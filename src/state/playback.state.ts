import { create } from "zustand"
import { NamedId, Track, UUID } from "@thoth/client"

export type PlaybackTrack = Track & { authors: NamedId[] } & { coverID: string | null | undefined } & {
  libraryId: UUID
}

interface PlaybackState {
  history: PlaybackTrack[]
  queue: PlaybackTrack[]
  current: PlaybackTrack | null | undefined
  autoplay: boolean

  start: (track: PlaybackTrack, queue?: PlaybackTrack[], history?: PlaybackTrack[], autoplay?: boolean) => void

  jumpTo: (index: number) => void

  stop: () => void

  next: () => void

  previous: () => void
}

// Book-level position of whatever is playing right now, published at 1ce per second so any view
// showing that book (previews, continue listening, details) tracks playback without
// subscribing to raw audio events.
interface PlaybackProgress {
  libraryId: UUID | null
  bookId: UUID | null
  positionMs: number
}

export const usePlaybackProgress = create<PlaybackProgress>(() => ({
  libraryId: null,
  bookId: null,
  positionMs: 0,
}))

export const usePlaybackState = create<PlaybackState>((set, get) => ({
  history: [],
  queue: [],
  current: null,
  autoplay: true,
  start(track: PlaybackTrack, queue: PlaybackTrack[] = [], history: PlaybackTrack[] = [], autoplay = true): void {
    set({
      history,
      queue,
      current: track,
      autoplay,
    })
  },
  jumpTo(index: number): void {
    const state = get()
    if (!state.current) return
    const timeline = [...state.history, state.current, ...state.queue]
    const target = timeline[index]
    if (!target || target.id === state.current.id) return
    set({
      history: timeline.slice(0, index),
      queue: timeline.slice(index + 1),
      current: target,
      autoplay: true,
    })
  },
  stop(): void {
    set({
      history: [],
      queue: [],
      current: null,
    })
  },
  next(): void {
    const state = get()
    const next = state.queue.shift()
    if (!next) return

    set({
      queue: [...state.queue],
      history: [...state.history, ...(state.current ? [state.current] : [])],
      current: next,
      autoplay: true,
    })
  },
  previous(): void {
    const state = get()
    const previous = state.history.pop()
    if (!previous) return

    set({
      queue: [...(state.current ? [state.current] : []), ...state.queue],
      history: [...state.history],
      current: previous,
      autoplay: true,
    })
  },
}))
