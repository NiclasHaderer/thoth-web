import { toast } from "sonner"
import { BookDetailed, UUID } from "@thoth/client"
import { queryClient } from "@thoth/client/query-client"
import { localUrl, trackSrc } from "@thoth/downloads"
import { isOnline } from "@thoth/hooks/online-status"
import { queries } from "@thoth/queries/query-definitions"
import { preferences } from "@thoth/state/preferences"
import { audio } from "./active-audio-output"
import { bookStarted, bookStopped, clearResume } from "./playback-progress"
import { usePlaybackResume } from "./playback-resume"
import { NO_SLEEP, PlayingBook, SleepTimer, usePlayback } from "./playback-store"
import { locateTrack } from "./track-position"

export const RESTART_THRESHOLD = 5
export const SKIP_BACK = 15
export const SKIP_FORWARD = 30

export interface PlayOptions {
  // Book-level position; defaults to the stored progress when the book is in progress.
  at?: number
  track?: number
  autoplay?: boolean
}

const toPlayingBook = (book: BookDetailed): PlayingBook => ({
  libraryId: book.libraryId,
  id: book.id,
  title: book.title,
  durationMs: book.durationMs,
  authors: book.authors,
  coverID: book.coverID,
  tracks: book.tracks,
})

const load = (book: PlayingBook, index: number, offsetMs: number, autoplay: boolean) => {
  const track = book.tracks[index]
  if (!isOnline() && !localUrl(track.id)) {
    const message = `${book.title} is not downloaded and unavailable offline`
    toast.error(message, { id: message })
    return
  }
  const previous = usePlayback.getState()
  const changed = previous.book?.id !== book.id
  if (changed) void bookStopped(previous)
  audio.load(trackSrc(track), offsetMs / 1000, autoplay)
  usePlayback.setState({ book, trackIndex: index, track })
  if (changed) void bookStarted()
}

// Picking the qplaying book again only resumes it: its cached position is behind the audio.
const play = async (
  target: BookDetailed | { libraryId: UUID; bookId: UUID },
  { at, track, autoplay = true }: PlayOptions = {}
): Promise<boolean> => {
  const id = "bookId" in target ? target.bookId : target.id
  if (usePlayback.getState().book?.id === id && at === undefined && track === undefined) {
    audio.setPlaying(autoplay)
    return true
  }

  const book =
    "bookId" in target
      ? await queryClient.query(queries.books.detail(target.libraryId, target.bookId)).catch(() => undefined)
      : target
  if (!book || book.tracks.length === 0) return false
  if (track !== undefined) {
    if (!book.tracks[track]) return false
    load(toPlayingBook(book), track, 0, autoplay)
    return true
  }
  const resumeAt = book.status === "IN_PROGRESS" ? book.positionMs : 0
  const { index, offsetMs } = locateTrack(book.tracks, at ?? resumeAt)
  load(toPlayingBook(book), index, offsetMs, autoplay)
  return true
}

const jumpTo = (index: number, offsetMs = 0) => {
  const { book } = usePlayback.getState()
  if (book?.tracks[index]) load(book, index, offsetMs, true)
}

const next = () => jumpTo(usePlayback.getState().trackIndex + 1)

// Restarts the track, or goes back one when the current one has barely started.
const previous = () => {
  const { trackIndex } = usePlayback.getState()
  if (trackIndex > 0 && audio.currentTime() <= RESTART_THRESHOLD) return jumpTo(trackIndex - 1)
  audio.seek(0)
}

const skip = (seconds: number) => {
  const { book, trackIndex: index } = usePlayback.getState()
  if (!book) return
  const target = audio.currentTime() + seconds
  const duration = audio.duration()
  const before = book.tracks[index - 1]
  if (target < 0 && before) return jumpTo(index - 1, before.durationMs + target * 1000)
  if (Number.isFinite(duration) && target > duration && book.tracks[index + 1])
    return jumpTo(index + 1, (target - duration) * 1000)
  audio.seek(Math.max(0, target))
}

// Without sync the stored position stays untouched. The server derives the finished flag from the
// position, so a write here would immediately undo a mark-as-played for the same book.
const stop = ({ sync = true }: { sync?: boolean } = {}) => {
  if (sync) void bookStopped(usePlayback.getState())
  usePlayback.setState({ book: null, trackIndex: 0, track: undefined })
  audio.unload()
  clearResume()
}

const reset = () => {
  audio.unload()
  usePlayback.setState(usePlayback.getInitialState(), true)
  usePlaybackResume.setState(usePlaybackResume.getInitialState(), true)
  usePlaybackResume.persist.clearStorage()
}

const setSleep = (sleep: Partial<SleepTimer>) => usePlayback.setState({ sleep: { ...NO_SLEEP, ...sleep } })

export const playback = {
  play,
  toggle: () => audio.setPlaying(usePlayback.getState().paused),
  setPlaying: audio.setPlaying,
  jumpTo,
  next,
  previous,
  skip,
  seek: audio.seek,
  setSpeed: preferences.setPlaybackSpeed,
  setVolume: preferences.setVolume,
  sleepIn: (minutes: number) => setSleep({ minutes, endsAt: Date.now() + minutes * 60_000 }),
  sleepAfterTrack: () => setSleep({ afterTrack: true }),
  cancelSleep: () => setSleep({}),
  stop,
  reset,
}
