import { create } from "zustand"
import { NamedId, Track, UUID } from "@thoth/client"

type PlaybackTrack = Track & { authors: NamedId[] } & { coverID: string | null | undefined } & {
  libraryId: UUID
}

interface PlaybackState {
  history: PlaybackTrack[]
  queue: PlaybackTrack[]
  current: PlaybackTrack | null | undefined

  start: (track: PlaybackTrack, queue?: PlaybackTrack[], history?: PlaybackTrack[]) => void

  stop: () => void

  next: () => void

  previous: () => void
}

export const usePlaybackState = create<PlaybackState>((set, get) => ({
  history: [],
  queue: [],
  current: null,
  start(track: PlaybackTrack, queue: PlaybackTrack[] = [], history: PlaybackTrack[] = []): void {
    set({
      history,
      queue,
      current: track,
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
    if (!next) return state.stop()

    set({
      queue: [...state.queue],
      history: [...state.history, ...(state.current ? [state.current] : [])],
      current: next,
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
    })
  },
}))
