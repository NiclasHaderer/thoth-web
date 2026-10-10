import { Api, PlayStatus } from "@thoth/client"
import { queryClient } from "@thoth/client/query-client"
import { cachedBook, invalidateLibraryContent, patchBook } from "@thoth/queries/query-cache"
import { queries } from "@thoth/queries/query-definitions"
import { audio } from "./active-audio-output"
import { usePlaybackResume } from "./playback-resume"
import { PlaybackState, PlayingBook, usePlayback } from "./playback-store"
import { trackStartMs } from "./track-position"

type Playing = Pick<PlaybackState, "book" | "trackIndex">

export const bookPositionMs = (state: Playing = usePlayback.getState()): number =>
  state.book ? Math.round(trackStartMs(state.book.tracks, state.trackIndex) + audio.currentTime() * 1000) : 0

// Mirrors the server's status derivation in ProgressRepository.setProgress and UserBookProgressTable.
const FINISHED_THRESHOLD_MS = 30_000

const statusAt = (book: PlayingBook, positionMs: number): PlayStatus => {
  if (book.durationMs > 0 && positionMs >= book.durationMs - FINISHED_THRESHOLD_MS) return "FINISHED"
  return positionMs > 0 ? "IN_PROGRESS" : "UNPLAYED"
}

// Refetch only after the write lands: the server derives all of this from the stored position.
const syncProgress = async (book: PlayingBook, positionMs: number) => {
  try {
    await Api.setBookProgress({ libraryId: book.libraryId, id: book.id }, { positionMs })
  } catch {
    return
  }
  await queryClient.invalidateQueries({ queryKey: queries.continueListening.queryKey })

  const cached = cachedBook(queryClient, book.libraryId, book.id)
  if (cached && cached.status !== statusAt(book, positionMs)) {
    await invalidateLibraryContent(queryClient, book.libraryId)
  }
}

export const syncCurrentProgress = (): Promise<void> => {
  const { book } = usePlayback.getState()
  return book ? syncProgress(book, bookPositionMs()) : Promise.resolve()
}

export const writeResume = () => {
  const { book } = usePlayback.getState()
  if (!book) return
  usePlaybackResume.setState({ resume: { libraryId: book.libraryId, bookId: book.id, positionMs: bookPositionMs() } })
}

export const clearResume = () => usePlaybackResume.setState({ resume: null })

// Called before the audio moves on, while the position still belongs to the stopped book.
export const bookStopped = (stopped: Playing): Promise<void> => {
  if (!stopped.book) return Promise.resolve()
  const positionMs = bookPositionMs(stopped)
  patchBook(queryClient, stopped.book.libraryId, stopped.book.id, () => ({ positionMs }))
  return syncProgress(stopped.book, positionMs)
}

// A freshly started book has no stored progress yet, so it is missing from continue listening
// until the server has seen it once. Sync right away instead of waiting out the interval.
export const bookStarted = (): Promise<void> => {
  writeResume()
  return syncCurrentProgress()
}
