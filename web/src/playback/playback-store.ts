import { create } from "zustand"
import { NamedId, Track, UUID } from "@thoth/client"
import { PlaybackSnapshot } from "./audio-output"

export interface PlayingBook {
  libraryId: UUID
  id: UUID
  title: string
  durationMs: number
  authors: NamedId[]
  coverID: UUID | undefined
  tracks: Track[]
}

export interface SleepTimer {
  minutes: number | null
  endsAt: number | null
  afterTrack: boolean
}

export interface PlaybackState extends PlaybackSnapshot {
  book: PlayingBook | null
  trackIndex: number
  track: Track | undefined
  sleep: SleepTimer
}

export const NO_SLEEP: SleepTimer = { minutes: null, endsAt: null, afterTrack: false }

export const usePlayback = create<PlaybackState>(() => ({
  book: null,
  trackIndex: 0,
  track: undefined,
  paused: true,
  currentTime: 0,
  duration: NaN,
  volume: 1,
  speed: 1,
  sleep: NO_SLEEP,
}))

export const hasNextTrack = (state: PlaybackState): boolean =>
  !!state.book && state.trackIndex < state.book.tracks.length - 1
