import { useAnimationFrame, useMotionValue } from "motion/react"
import { useEffect, useRef } from "react"
import { Book } from "@thoth/client"
import { audio } from "./active-audio-output"
import { playback, RESTART_THRESHOLD } from "./playback-actions"
import { PlaybackState, usePlayback } from "./playback-store"
import { trackStartMs } from "./track-position"

export const useCanGoPrevious = () => usePlayback(s => s.trackIndex > 0 || s.currentTime > RESTART_THRESHOLD)

const currentFraction = () => {
  const { currentTime, duration } = audio.snapshot()
  return Number.isFinite(duration) && duration > 0 ? currentTime / duration : 0
}

// Scrubbable track progress as a motion value, sampled per frame instead of per timeupdate.
export const useTrackProgress = () => {
  const progress = useMotionValue(0)
  const scrubbing = useRef(false)

  useAnimationFrame(() => {
    if (scrubbing.current) return
    const next = currentFraction()
    if (progress.get() !== next) progress.set(next)
  })

  return {
    progress,
    scrub: (fraction: number) => {
      scrubbing.current = true
      progress.set(fraction)
    },
    scrubEnd: (fraction: number) => {
      progress.set(fraction)
      const duration = audio.duration()
      if (Number.isFinite(duration)) playback.seek(duration * fraction)
      scrubbing.current = false
    },
  }
}

export const useVolume = () => {
  const level = usePlayback(s => s.volume)
  const progress = useMotionValue(level)

  useEffect(() => {
    progress.set(level)
  }, [level, progress])

  return { level, progress, set: playback.setVolume }
}

// Live book-level progress: follows playback for the book that is playing, the cached position
// otherwise. The selectors keep books that are not playing from re-rendering on playback ticks,
// and whole seconds keep the playing one to one render per second.
const playing = (s: PlaybackState, book: Book) => s.book?.id === book.id && s.book.libraryId === book.libraryId

export const useBookProgress = (book: Book) => {
  const isCurrent = usePlayback(s => playing(s, book))
  const positionMs = usePlayback(s =>
    s.book && playing(s, book)
      ? trackStartMs(s.book.tracks, s.trackIndex) + Math.floor(s.currentTime) * 1000
      : book.positionMs
  )
  const finished = book.status === "FINISHED"

  return {
    finished,
    positionMs,
    remainingMs: Math.max(0, book.durationMs - positionMs),
    fraction: book.durationMs > 0 ? Math.min(1, positionMs / book.durationMs) : 0,
    inProgress: !finished && book.durationMs > 0 && (positionMs > 0 || isCurrent),
  }
}
