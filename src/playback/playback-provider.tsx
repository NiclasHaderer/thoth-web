import { FC, ReactNode, useEffect } from "react"
import { useLocation, useSearch } from "wouter"
import { ThothApiError } from "@thoth/client"
import { queryClient } from "@thoth/client/query-client"
import { queries } from "@thoth/queries/query-definitions"
import { usePreferences } from "@thoth/state/preferences"
import { withoutSearchParam } from "@thoth/utils/utils"
import { audio } from "./active-audio-output"
import { playback } from "./playback-actions"
import { clearResume, syncCurrentProgress, writeResume } from "./playback-progress"
import { usePlaybackResume } from "./playback-resume"
import { usePlayback } from "./playback-store"

const PERSIST_INTERVAL = 15_000

const persistNow = () => {
  writeResume()
  void syncCurrentProgress()
}

const usePersistWhilePlaying = () => {
  const playing = usePlayback(s => !s.paused)

  useEffect(() => {
    if (!playing) return
    const timer = setInterval(persistNow, PERSIST_INTERVAL)
    return () => clearInterval(timer)
  }, [playing])
}

const onEnded = () => {
  if (usePlayback.getState().sleep.afterTrack) playback.cancelSleep()
  else playback.next()
}

const copyOutputState = () => usePlayback.setState(audio.snapshot())

const connectOutput = () => {
  // Events fired while disconnected were missed, so start from the output's current state.
  copyOutputState()
  const disconnect = [
    audio.subscribe(copyOutputState),
    audio.on("pause", persistNow),
    audio.on("seeked", persistNow),
    audio.on("ended", onEnded),
  ]
  window.addEventListener("pagehide", persistNow)
  return () => {
    disconnect.forEach(off => off())
    window.removeEventListener("pagehide", persistNow)
  }
}

const useApplyPreferences = () => {
  const volume = usePreferences(s => s.volume)
  const speed = usePreferences(s => s.playbackSpeed)

  useEffect(() => audio.setVolume(volume), [volume])
  useEffect(() => audio.setSpeed(speed), [speed])
}

const useSleepCountdown = () => {
  const endsAt = usePlayback(s => s.sleep.endsAt)

  useEffect(() => {
    if (!endsAt) return
    const timer = setTimeout(
      () => {
        playback.setPlaying(false)
        playback.cancelSleep()
      },
      Math.max(0, endsAt - Date.now())
    )
    return () => clearTimeout(timer)
  }, [endsAt])
}

let restoreAttempted = false

const useRestorePlayback = () => {
  const [path, navigate] = useLocation()
  const search = useSearch()

  useEffect(() => {
    if (restoreAttempted || usePlayback.getState().book) return
    restoreAttempted = true

    const clearPlayerParam = () => {
      if (new URLSearchParams(search).has("player"))
        navigate(withoutSearchParam(path, search, "player"), { replace: true })
    }

    const stored = usePlaybackResume.getState().resume
    if (!stored) return clearPlayerParam()

    queryClient
      .query(queries.books.detail(stored.libraryId, stored.bookId))
      .then(async book => {
        if (!(await playback.play(book, { at: stored.positionMs, autoplay: false }))) {
          clearResume()
          clearPlayerParam()
        }
      })
      .catch((error: unknown) => {
        if (error instanceof ThothApiError && error.status === 404) clearResume()
        clearPlayerParam()
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

// Only the lifecycle lives here; actions stay on `playback` so non-React code can call them.
export const PlaybackProvider: FC<{ children: ReactNode }> = ({ children }) => {
  useEffect(connectOutput, [])
  useApplyPreferences()
  usePersistWhilePlaying()
  useSleepCountdown()
  useRestorePlayback()
  return children
}
