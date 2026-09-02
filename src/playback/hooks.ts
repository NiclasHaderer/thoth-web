import { useAnimationFrame, useMotionValue } from "motion/react"
import { useEffect, useRef } from "react"
import { Book } from "@thoth/client"
import { audio, useAudio } from "./audio"
import { RESTART_THRESHOLD } from "./controller"
import { currentTrack, usePlayback, usePlaybackProgress } from "./state"

export const useCurrentTrack = () => usePlayback(currentTrack)

export const usePlaying = () => useAudio(media => !media.paused)

export const useCanGoPrevious = () => {
  const hasPrevious = usePlayback(s => s.trackIndex > 0)
  const position = useAudio(media => media.currentTime)
  return hasPrevious || position > RESTART_THRESHOLD
}

const currentFraction = (media: HTMLAudioElement) =>
  Number.isFinite(media.duration) && media.duration > 0 ? media.currentTime / media.duration : 0

// Scrubbable track progress as a motion value, sampled per frame instead of per timeupdate.
export const useTrackProgress = () => {
  const progress = useMotionValue(0)
  const scrubbing = useRef(false)

  useAnimationFrame(() => {
    if (scrubbing.current) return
    const next = currentFraction(audio.element())
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
      if (Number.isFinite(duration)) audio.seek(duration * fraction)
      scrubbing.current = false
    },
  }
}

export const useVolume = () => {
  const level = useAudio(media => media.volume)
  const progress = useMotionValue(level)

  useEffect(() => {
    progress.set(level)
  }, [level, progress])

  return { level, progress, set: audio.setVolume }
}

// Live book-level progress: follows playback for the book that is playing, the cached position
// otherwise. The selectors keep books that are not playing from re-rendering on playback ticks.
export const useBookProgress = (book: Book) => {
  const isCurrent = usePlaybackProgress(s => s.bookId === book.id && s.libraryId === book.libraryId)
  const positionMs = usePlaybackProgress(s =>
    s.bookId === book.id && s.libraryId === book.libraryId ? s.positionMs : book.positionMs
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
