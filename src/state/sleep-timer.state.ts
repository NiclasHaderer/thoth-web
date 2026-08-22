import { create } from "zustand"

interface SleepTimerState {
  minutes: number | null
  endsAt: number | null
  untilEndOfTrack: boolean

  startCountdown: (minutes: number) => void
  stopAfterTrack: () => void
  clear: () => void
}

export const useSleepTimer = create<SleepTimerState>(set => ({
  minutes: null,
  endsAt: null,
  untilEndOfTrack: false,
  startCountdown(minutes: number): void {
    set({ minutes, endsAt: Date.now() + minutes * 60_000, untilEndOfTrack: false })
  },
  stopAfterTrack(): void {
    set({ minutes: null, endsAt: null, untilEndOfTrack: true })
  },
  clear(): void {
    set({ minutes: null, endsAt: null, untilEndOfTrack: false })
  },
}))
