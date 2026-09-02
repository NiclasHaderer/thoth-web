import { Api, UUID } from "@thoth/client"
import { queryClient } from "@thoth/client/query-client"
import { cachedBook, invalidateLibraryContent, patchBook } from "@thoth/queries/cache"
import { queries } from "@thoth/queries/queries"
import { audio } from "./audio"
import { trackStartMs } from "./position"
import { PlaybackState, PlayingBook, usePlayback, usePlaybackProgress } from "./state"

const RESUME_KEY = "thoth.playback"

export const bookPositionMs = (state: PlaybackState = usePlayback.getState()): number =>
  state.book ? Math.round(trackStartMs(state.book.tracks, state.trackIndex) + audio.currentTime() * 1000) : 0

export const publishProgress = () => {
  const { book } = usePlayback.getState()
  usePlaybackProgress.setState(
    book
      ? { libraryId: book.libraryId, bookId: book.id, positionMs: bookPositionMs() }
      : { libraryId: null, bookId: null, positionMs: 0 }
  )
}

// Mirrors the window the server uses to call a book finished. Kept in step with
// FINISHED_THRESHOLD_MS in its ProgressRepository.
const FINISHED_THRESHOLD_MS = 30_000

const isFinished = (book: PlayingBook, positionMs: number) =>
  book.durationMs > 0 && positionMs >= book.durationMs - FINISHED_THRESHOLD_MS

// Continue listening is derived from the stored progress, so it is only refreshed once the
// server has actually taken the new position.
const syncProgress = async (book: PlayingBook, positionMs: number) => {
  try {
    await Api.setBookProgress({ libraryId: book.libraryId, id: book.id }, { positionMs })
  } catch {
    return
  }
  await queryClient.invalidateQueries({ queryKey: queries.continueListening.queryKey })

  // The server also derives the play status from the position it just took. Crossing the finish
  // line changes what every list and detail view shows, and only then is a re-read worth its cost.
  const cached = cachedBook(queryClient, book.libraryId, book.id)
  if (cached && (cached.status === "FINISHED") !== isFinished(book, positionMs)) {
    await invalidateLibraryContent(queryClient, book.libraryId)
  }
}

export const syncCurrentProgress = (): Promise<void> => {
  const { book } = usePlayback.getState()
  return book ? syncProgress(book, bookPositionMs()) : Promise.resolve()
}

export interface StoredResume {
  libraryId: UUID
  bookId: UUID
  positionSec: number
  rate: number
}

export const readResume = (): StoredResume | null => {
  try {
    return JSON.parse(localStorage.getItem(RESUME_KEY) ?? "null") as StoredResume | null
  } catch {
    return null
  }
}

export const writeResume = () => {
  const { book } = usePlayback.getState()
  if (!book) return
  const stored: StoredResume = {
    libraryId: book.libraryId,
    bookId: book.id,
    positionSec: bookPositionMs() / 1000,
    rate: audio.element().playbackRate,
  }
  localStorage.setItem(RESUME_KEY, JSON.stringify(stored))
}

export const clearResume = () => localStorage.removeItem(RESUME_KEY)

// The write has to land before the refetch. The server derives the play status from the stored
// position, so reading first would cache the status the write is about to change, and nothing
// downstream would correct it.
const syncThenRefresh = async (sync: Promise<void>, libraryId: UUID) => {
  await sync
  await invalidateLibraryContent(queryClient, libraryId)
}

// Called before the audio moves on, while the position still belongs to the stopped book.
export const bookStopped = (stopped: PlaybackState): Promise<void> => {
  if (!stopped.book) return Promise.resolve()
  const { libraryId, id } = stopped.book
  const positionMs = bookPositionMs(stopped)
  patchBook(queryClient, libraryId, id, () => ({ positionMs }))
  return syncThenRefresh(syncProgress(stopped.book, positionMs), libraryId)
}

// A freshly started book has no stored progress yet, so it is missing from continue listening
// until the server has seen it once. Sync right away instead of waiting out the interval.
export const bookStarted = (book: PlayingBook): Promise<void> => {
  publishProgress()
  writeResume()
  return syncThenRefresh(syncCurrentProgress(), book.libraryId)
}
