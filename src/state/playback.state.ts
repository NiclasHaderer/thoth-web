import { create } from "zustand"
import { NamedId, Track, UUID } from "@thoth/client"

export type PlaybackTrack = Track & { authors: NamedId[] } & { coverID: string | null | undefined } & {
  libraryId: UUID
}

interface PlaybackState {
  history: PlaybackTrack[]
  queue: PlaybackTrack[]
  current: PlaybackTrack | null | undefined

  start: (track: PlaybackTrack, queue?: PlaybackTrack[], history?: PlaybackTrack[]) => void

  jumpTo: (index: number) => void

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
