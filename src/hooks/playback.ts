import { useQueryClient } from "@tanstack/react-query"
import { useAnimationFrame, useMotionValue } from "motion/react"
import { useCallback, useEffect, useRef, useSyncExternalStore } from "react"
import { UUID } from "@thoth/client"
import { useEvent } from "@thoth/hooks/events"
import { bookDetailQuery } from "@thoth/queries/resources"
import { usePlaybackState } from "@thoth/state/playback.state"
import { useSleepTimer } from "@thoth/state/sleep-timer.state"

let element: HTMLAudioElement | undefined
const audio = (): HTMLAudioElement => (element ??= document.createElement("audio"))

export const useAudioSource = (url: string | undefined | null, autoplay = true) => {
  useEffect(() => {
    const media = audio()
    if (!url) {
      media.pause()
      media.removeAttribute("src")
      media.load()
      return
    }
    media.src = url
    if (autoplay) void media.play().catch(() => {})
  }, [url, autoplay])
}

const useAudioSnapshot = <T>(events: string[], getSnapshot: (audio: HTMLAudioElement) => T): T => {
  const subscribe = useCallback((onChange: () => void) => {
    const media = audio()
    events.forEach(event => media.addEventListener(event, onChange))
    return () => events.forEach(event => media.removeEventListener(event, onChange))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return useSyncExternalStore(subscribe, () => getSnapshot(audio()))
}

export const usePlaybackPosition = (): [number, (seconds: number) => void] => {
  const position = useAudioSnapshot(["timeupdate", "emptied"], a => a.currentTime)

  return [
    position,
    (seconds: number) => {
      audio().currentTime = seconds
    },
  ]
}

export const useDuration = (): number => useAudioSnapshot(["durationchange", "emptied"], a => a.duration)

const currentPercentage = (media: HTMLAudioElement) =>
  Number.isFinite(media.duration) && media.duration > 0 ? media.currentTime / media.duration : 0

export const useProgress = () => {
  const progress = useMotionValue(0)
  const scrubbing = useRef(false)

  useAnimationFrame(() => {
    if (scrubbing.current) return
    const next = currentPercentage(audio())
    if (progress.get() !== next) progress.set(next)
  })

  const seek = (percentage: number) => {
    const media = audio()
    if (!Number.isFinite(media.duration)) return
    media.currentTime = media.duration * percentage
    void media.play().catch(() => {})
  }

  return {
    progress,
    scrub: (percentage: number) => {
      scrubbing.current = true
      progress.set(percentage)
    },
    scrubEnd: (percentage: number) => {
      progress.set(percentage)
      seek(percentage)
      scrubbing.current = false
    },
  }
}

export const usePlayState = (): [boolean, (shouldPlay: boolean) => void] => {
  const playing = useAudioSnapshot(["play", "pause", "ended", "emptied"], a => !a.paused)

  return [
    playing,
    useCallback((shouldPlay: boolean) => {
      const media = audio()
      if (shouldPlay) {
        void media.play().catch(() => {})
      } else {
        media.pause()
      }
    }, []),
  ]
}

export const useSkip = () =>
  useCallback((seconds: number) => {
    const media = audio()
    media.currentTime = Math.max(0, media.currentTime + seconds)
  }, [])

export const usePlaybackRate = (): [number, (rate: number) => void] => {
  const rate = useAudioSnapshot(["ratechange", "emptied"], a => a.playbackRate)

  return [
    rate,
    (next: number) => {
      const media = audio()
      media.defaultPlaybackRate = next
      media.playbackRate = next
    },
  ]
}

export const useSleepTimerPause = () => {
  const endsAt = useSleepTimer(s => s.endsAt)
  const clear = useSleepTimer(s => s.clear)

  useEffect(() => {
    if (!endsAt) return
    const timer = setTimeout(
      () => {
        audio().pause()
        clear()
      },
      Math.max(0, endsAt - Date.now())
    )
    return () => clearTimeout(timer)
  }, [endsAt, clear])
}

export const useAutoAdvance = (advance: () => void) => {
  const untilEndOfTrack = useSleepTimer(s => s.untilEndOfTrack)
  const clear = useSleepTimer(s => s.clear)

  useEvent(audio(), "ended", () => {
    if (untilEndOfTrack) {
      clear()
    } else {
      advance()
    }
  })
}

export const RESTART_THRESHOLD = 5
export const SKIP_BACK = 15
export const SKIP_FORWARD = 30

export const usePreviousTrack = (): [() => void, boolean] => {
  const previous = usePlaybackState(s => s.previous)
  const hasHistory = usePlaybackState(s => s.history.length > 0)
  const position = useAudioSnapshot(["timeupdate", "emptied"], a => a.currentTime)

  return [
    () => {
      const media = audio()
      if (hasHistory && media.currentTime <= RESTART_THRESHOLD) return previous()
      media.currentTime = 0
    },
    hasHistory || position > RESTART_THRESHOLD,
  ]
}

export const usePlayBook = () => {
  const play = usePlaybackState(s => s.start)
  const queryClient = useQueryClient()

  return async (libraryId: UUID, bookId: UUID) => {
    const book = await queryClient.fetchQuery(bookDetailQuery(libraryId, bookId)).catch(() => undefined)
    if (!book) return
    const [first, ...queue] = book.tracks.map(track => ({
      ...track,
      authors: book.authors,
      coverID: book.coverID,
      libraryId,
    }))
    if (!first) return
    play(first, queue)
  }
}
