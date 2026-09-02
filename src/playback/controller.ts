import { BookDetailed, Track, UUID } from "@thoth/client"
import { queryClient } from "@thoth/client/query-client"
import { queries } from "@thoth/queries/queries"
import { audio } from "./audio"
import { locateTrack } from "./position"
import { bookStarted, bookStopped, clearResume, publishProgress } from "./progress"
import { PlayingBook, usePlayback } from "./state"

export const RESTART_THRESHOLD = 5
export const SKIP_BACK = 15
export const SKIP_FORWARD = 30

const trackUrl = (track: Track) => `/api/stream/audio/${track.id}`

const toPlayingBook = (book: BookDetailed, libraryId: UUID): PlayingBook => ({
  libraryId,
  id: book.id,
  title: book.title,
  durationMs: book.durationMs,
  authors: book.authors,
  coverID: book.coverID,
  tracks: book.tracks,
})

const playTrack = (book: PlayingBook, index: number, offsetMs: number, autoplay: boolean) => {
  const previous = usePlayback.getState()
  const changed = previous.book?.id !== book.id
  if (changed) void bookStopped(previous)
  audio.load(trackUrl(book.tracks[index]), offsetMs / 1000, autoplay)
  usePlayback.setState({ book, trackIndex: index })
  if (changed) void bookStarted(book)
}

export const startBook = (book: BookDetailed, libraryId: UUID, positionMs: number, autoplay = true): boolean => {
  if (book.tracks.length === 0) return false
  const { index, offsetMs } = locateTrack(book.tracks, positionMs)
  playTrack(toPlayingBook(book, libraryId), index, offsetMs, autoplay)
  return true
}

export const startTrack = (book: BookDetailed, libraryId: UUID, index: number) => {
  if (book.tracks[index]) playTrack(toPlayingBook(book, libraryId), index, 0, true)
}

export const jumpToTrack = (index: number, offsetMs = 0) => {
  const { book } = usePlayback.getState()
  if (book?.tracks[index]) playTrack(book, index, offsetMs, true)
}

export const nextTrack = () => jumpToTrack(usePlayback.getState().trackIndex + 1)

export const previousTrack = () => jumpToTrack(usePlayback.getState().trackIndex - 1)

// Restarts the track, or goes back one when the current one has barely started.
export const previousOrRestart = () => {
  if (usePlayback.getState().trackIndex > 0 && audio.currentTime() <= RESTART_THRESHOLD) return previousTrack()
  audio.seek(0)
}

export const skip = (seconds: number) => {
  const { book, trackIndex: index } = usePlayback.getState()
  if (!book) return
  const target = audio.currentTime() + seconds
  const duration = audio.duration()
  const previous = book.tracks[index - 1]
  if (target < 0 && previous) return jumpToTrack(index - 1, previous.durationMs + target * 1000)
  if (Number.isFinite(duration) && target > duration && book.tracks[index + 1])
    return jumpToTrack(index + 1, (target - duration) * 1000)
  audio.seek(Math.max(0, target))
}

// Ends playback and leaves the stored position untouched. The server derives the finished flag
// from the position, so a write here would immediately undo a mark-as-played for the same book.
export const stopWithoutSync = () => {
  usePlayback.setState({ book: null, trackIndex: 0 })
  audio.unload()
  clearResume()
  publishProgress()
}

export const stop = () => {
  void bookStopped(usePlayback.getState())
  stopWithoutSync()
}

export const playBookById = async (libraryId: UUID, bookId: UUID) => {
  // The playing book's cached position is stale; picking it again just resumes the audio.
  if (usePlayback.getState().book?.id === bookId) return audio.play()

  const book = await queryClient.fetchQuery(queries.books.detail(libraryId, bookId)).catch(() => undefined)
  if (book) startBook(book, libraryId, book.status === "IN_PROGRESS" ? book.positionMs : 0)
}
