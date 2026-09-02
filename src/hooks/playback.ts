import { useQueryClient } from "@tanstack/react-query"
import { useAnimationFrame, useMotionValue } from "motion/react"
import { useCallback, useEffect, useMemo, useRef, useSyncExternalStore } from "react"
import { useLocation, useSearch } from "wouter"
import { Api, Book, BookDetailed, ThothApiError, UUID } from "@thoth/client"
import { useEvent } from "@thoth/hooks/events"
import { invalidateLibraryContent } from "@thoth/queries/invalidate"
import { queryKeys } from "@thoth/queries/keys"
import { bookDetailQuery } from "@thoth/queries/resources"
import { PlaybackTrack, usePlaybackProgress, usePlaybackState } from "@thoth/state/playback.state"
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

const toPlaybackTracks = (book: BookDetailed, libraryId: UUID): PlaybackTrack[] =>
  book.tracks.map(track => ({ ...track, authors: book.authors, coverID: book.coverID, libraryId }))

const startTracks = (tracks: PlaybackTrack[], index: number, offsetSeconds: number, autoplay: boolean) => {
  const media = audio()
  if (media.src.endsWith(`/${tracks[index].id}`)) {
    // The source stays the same, so nothing reloads: neither a queued seek nor the
    // autoplay of useAudioSource would ever fire. Apply both directly.
    pendingSeek = null
    media.currentTime = offsetSeconds
    if (autoplay) void media.play().catch(() => {})
  } else {
    // Queued before the state change so every listener already sees where the book resumes,
    // instead of briefly reporting the start of the track. Always queued, so a stale seek
    // from an earlier aborted start can never apply to this track.
    seekWhenLoaded(offsetSeconds)
  }
  usePlaybackState.getState().start(tracks[index], tracks.slice(index + 1), tracks.slice(0, index), autoplay)
}

export const startBookAt = (book: BookDetailed, libraryId: UUID, positionSeconds: number, autoplay = true): boolean => {
  const tracks = toPlaybackTracks(book, libraryId)
  if (tracks.length === 0) return false

  let index = 0
  let offset = Math.max(0, positionSeconds)
  while (index < tracks.length - 1 && offset >= tracks[index].durationMs / 1000)
    offset -= tracks[index++].durationMs / 1000

  startTracks(tracks, index, offset, autoplay)
  return true
}

export const startBookTrack = (book: BookDetailed, libraryId: UUID, index: number) => {
  const tracks = toPlaybackTracks(book, libraryId)
  if (tracks[index]) startTracks(tracks, index, 0, true)
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
const PROGRESS_SYNC_INTERVAL = 15000
const PROGRESS_PUBLISH_INTERVAL = 1000

// tick() runs fn at most once per interval; now() runs it immediately and restarts the window.
const throttled = (interval: number, fn: () => void) => {
  let last = 0
  const now = () => {
    last = Date.now()
    fn()
  }
  return {
    now,
    tick: () => {
      if (Date.now() - last >= interval) now()
    },
  }
}

// Set when a book starts, cleared by the first sync that carries a trustworthy position.
let startPending = false

type PlaybackSnapshot = { history: PlaybackTrack[]; current: PlaybackTrack | null | undefined }

const historyMs = (state: PlaybackSnapshot) => state.history.reduce((sum, track) => sum + track.durationMs, 0)

// The element keeps the previous track's currentTime until the new source is loaded, so it says
// nothing about the current book until then. A queued seek does: it is where the book resumes.
const currentTimeMs = (track: PlaybackTrack): number | null => {
  const queued = pendingSeek !== null && usePlaybackState.getState().current?.id === track.id
  if (queued) return (pendingSeek as number) * 1000
  return audio().src.endsWith(`/${track.id}`) ? audio().currentTime * 1000 : null
}

const positionSettled = (track: PlaybackTrack) => currentTimeMs(track) !== null

const bookPositionMs = (state: PlaybackSnapshot) =>
  Math.round(historyMs(state) + (state.current ? (currentTimeMs(state.current) ?? 0) : 0))

const publishProgress = (state: PlaybackSnapshot = usePlaybackState.getState()) => {
  if (!state.current) return usePlaybackProgress.setState({ libraryId: null, bookId: null, positionMs: 0 })
  usePlaybackProgress.setState({
    libraryId: state.current.libraryId,
    bookId: state.current.book.id,
    positionMs: bookPositionMs(state),
  })
}

const syncProgress = async (state: PlaybackSnapshot = usePlaybackState.getState()): Promise<boolean> => {
  if (!state.current || !positionSettled(state.current)) return false
  const response = await Api.setBookProgress(
    { libraryId: state.current.libraryId, id: state.current.book.id },
    { positionMs: bookPositionMs(state) }
  )
  return response.success
}

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

const publish = throttled(PROGRESS_PUBLISH_INTERVAL, publishProgress)
const resume = throttled(RESUME_WRITE_INTERVAL, writeResume)

export const usePersistPlayback = () => {
  const queryClient = useQueryClient()

  // Continue listening is derived from the stored progress, so it can only be refreshed
  // once the server has actually taken the new position.
  const sync = useCallback(
    (state?: PlaybackSnapshot) =>
      void syncProgress(state).then(written => {
        if (written) void queryClient.invalidateQueries({ queryKey: queryKeys.continueListening })
      }),
    [queryClient]
  )
  const throttledSync = useMemo(() => throttled(PROGRESS_SYNC_INTERVAL, sync), [sync])

  const persist = () => {
    publish.now()
    resume.now()
    throttledSync.now()
  }

  useEvent(audio(), "timeupdate", () => {
    // A freshly started book has no stored progress, so it is missing from continue listening
    // until the server has seen it once. Sync as soon as the position is trustworthy
    // instead of waiting out the sync interval.
    const current = usePlaybackState.getState().current
    if (startPending && current && positionSettled(current)) {
      startPending = false
      throttledSync.now()
    }
    publish.tick()
    resume.tick()
    throttledSync.tick()
  })
  useEvent(audio(), "pause", persist)
  useEvent(audio(), "seeked", persist)
  useEvent(audio(), "ratechange", resume.now)
  useEvent(window, "pagehide", persist)

  useEffect(
    () =>
      usePlaybackState.subscribe((state, previous) => {
        if (previous.current?.book.id === state.current?.book.id) return

        // Book changed or playback ended: flush the old book so every list picks up its new
        // position and status.
        const stoppedPositionMs = previous.current ? bookPositionMs(previous) : 0
        if (previous.current) sync(previous)
        if (!state.current) localStorage.removeItem(RESUME_KEY)
        startPending = Boolean(state.current)
        publishProgress(state)

        // The book that just started is pinned into the row by useContinueListening; only the
        // one that stopped needs its final position written into the cached list.
        if (previous.current) {
          const stopped = previous.current.book.id
          queryClient.setQueryData<Book[]>(queryKeys.continueListening, list =>
            list?.map(book => (book.id === stopped ? { ...book, positionMs: stoppedPositionMs } : book))
          )
        }

        for (const track of [previous.current, state.current]) {
          if (track) void invalidateLibraryContent(queryClient, track.libraryId)
        }
      }),
    [queryClient, sync]
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
        const media = audio()
        media.defaultPlaybackRate = stored.rate
        media.playbackRate = stored.rate
        if (!startBookAt(book, stored.libraryId, stored.position, false)) {
          localStorage.removeItem(RESUME_KEY)
          clearPlayerParam()
        }
      })
      .catch((error: unknown) => {
        if (error instanceof ThothApiError && error.status === 404) localStorage.removeItem(RESUME_KEY)
        clearPlayerParam()
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

export const usePlayBook = () => {
  const queryClient = useQueryClient()

  return async (libraryId: UUID, bookId: UUID) => {
    // The playing book's cached position is stale; picking it again just resumes the audio.
    if (usePlaybackState.getState().current?.book.id === bookId)
      return void audio()
        .play()
        .catch(() => {})

    const book = await queryClient.fetchQuery(bookDetailQuery(libraryId, bookId)).catch(() => undefined)
    if (!book) return
    const position = book.status === "IN_PROGRESS" ? book.positionMs / 1000 : 0
    startBookAt(book, libraryId, position)
  }
}
