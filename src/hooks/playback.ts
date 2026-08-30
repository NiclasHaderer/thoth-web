import { useQueryClient } from "@tanstack/react-query"
import { useAnimationFrame, useMotionValue } from "motion/react"
import { useCallback, useEffect, useRef, useSyncExternalStore } from "react"
import { useLocation, useSearch } from "wouter"
import { ThothApiError, UUID } from "@thoth/client"
import { useEvent } from "@thoth/hooks/events"
import { bookDetailQuery } from "@thoth/queries/resources"
import { usePlaybackState } from "@thoth/state/playback.state"
import { useSleepTimer } from "@thoth/state/sleep-timer.state"

const VOLUME_KEY = "thoth.volume"

let element: HTMLAudioElement | undefined
const audio = (): HTMLAudioElement => {
  if (element) return element
  element = document.createElement("audio")
  const stored = Number(localStorage.getItem(VOLUME_KEY) ?? NaN)
  if (Number.isFinite(stored)) element.volume = Math.min(1, Math.max(0, stored))
  return element
}

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

let pendingSeek: number | null = null
const applyPendingSeek = () => {
  if (pendingSeek === null) return
  const media = audio()
  media.currentTime = Math.min(Math.max(0, pendingSeek), media.duration)
  pendingSeek = null
}

const seekWhenLoaded = (seconds: number) => {
  if (pendingSeek === null) audio().addEventListener("loadedmetadata", applyPendingSeek, { once: true })
  pendingSeek = seconds
}

export const useSkip = () =>
  useCallback((seconds: number) => {
    const media = audio()
    const target = media.currentTime + seconds
    const state = usePlaybackState.getState()

    if (target < 0) {
      const previousTrack = state.history[state.history.length - 1]
      if (!previousTrack) {
        media.currentTime = 0
        return
      }
      state.previous()
      seekWhenLoaded(previousTrack.durationMs / 1000 + target)
      return
    }

    if (Number.isFinite(media.duration) && target > media.duration && state.queue.length > 0) {
      const overshoot = target - media.duration
      state.next()
      seekWhenLoaded(overshoot)
      return
    }

    media.currentTime = target
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

export const useVolume = () => {
  const level = useAudioSnapshot(["volumechange"], a => a.volume)
  const progress = useMotionValue(level)

  useEffect(() => {
    progress.set(level)
  }, [level, progress])

  const set = useCallback((percentage: number) => {
    const media = audio()
    media.volume = Math.min(1, Math.max(0, percentage))
    localStorage.setItem(VOLUME_KEY, String(media.volume))
  }, [])

  return { level, progress, set }
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

const RESUME_KEY = "thoth.playback"
const RESUME_WRITE_INTERVAL = 5000

interface StoredPlayback {
  libraryId: UUID
  bookId: UUID
  position: number
  rate: number
}

const readResume = (): StoredPlayback | null => {
  try {
    return JSON.parse(localStorage.getItem(RESUME_KEY) ?? "null") as StoredPlayback | null
  } catch {
    return null
  }
}

const writeResume = () => {
  const state = usePlaybackState.getState()
  if (!state.current) return
  const media = audio()
  const position = state.history.reduce((sum, track) => sum + track.durationMs / 1000, 0) + media.currentTime
  const stored: StoredPlayback = {
    libraryId: state.current.libraryId,
    bookId: state.current.book.id,
    position,
    rate: media.playbackRate,
  }
  localStorage.setItem(RESUME_KEY, JSON.stringify(stored))
}

export const usePersistPlayback = () => {
  const lastWrite = useRef(0)

  useEvent(audio(), "timeupdate", () => {
    if (Date.now() - lastWrite.current < RESUME_WRITE_INTERVAL) return
    lastWrite.current = Date.now()
    writeResume()
  })
  useEvent(audio(), "pause", writeResume)
  useEvent(audio(), "ratechange", writeResume)
  useEvent(window, "pagehide", writeResume)

  useEffect(
    () =>
      usePlaybackState.subscribe((state, previous) => {
        if (!state.current && previous.current) localStorage.removeItem(RESUME_KEY)
      }),
    []
  )
}

let restoreAttempted = false

export const useRestorePlayback = () => {
  const queryClient = useQueryClient()
  const [path, navigate] = useLocation()
  const search = useSearch()

  useEffect(() => {
    if (restoreAttempted || usePlaybackState.getState().current) return
    restoreAttempted = true

    const clearPlayerParam = () => {
      const params = new URLSearchParams(search)
      if (!params.has("player")) return
      params.delete("player")
      const rest = params.toString()
      navigate(rest ? `${path}?${rest}` : path, { replace: true })
    }

    const stored = readResume()
    if (!stored) return clearPlayerParam()

    queryClient
      .fetchQuery(bookDetailQuery(stored.libraryId, stored.bookId))
      .then(book => {
        const tracks = book.tracks.map(track => ({
          ...track,
          authors: book.authors,
          coverID: book.coverID,
          libraryId: stored.libraryId,
        }))
        if (tracks.length === 0) {
          localStorage.removeItem(RESUME_KEY)
          return clearPlayerParam()
        }

        let index = 0
        let offset = stored.position
        while (index < tracks.length - 1 && offset >= tracks[index].durationMs / 1000)
          offset -= tracks[index++].durationMs / 1000

        const media = audio()
        media.defaultPlaybackRate = stored.rate
        media.playbackRate = stored.rate
        usePlaybackState.getState().start(tracks[index], tracks.slice(index + 1), tracks.slice(0, index), false)
        seekWhenLoaded(offset)
      })
      .catch((error: unknown) => {
        if (error instanceof ThothApiError && error.status === 404) localStorage.removeItem(RESUME_KEY)
        clearPlayerParam()
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
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
