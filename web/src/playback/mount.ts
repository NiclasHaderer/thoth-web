import { useEffect } from "react"
import { useLocation, useSearch } from "wouter"
import { ThothApiError } from "@thoth/client"
import { queryClient } from "@thoth/client/query-client"
import { useEvent } from "@thoth/hooks/events"
import { queries } from "@thoth/queries/queries"
import { throttled, withoutSearchParam } from "@thoth/utils/utils"
import { audio } from "./audio"
import { nextTrack, startBook } from "./controller"
import { clearResume, publishProgress, readResume, syncCurrentProgress, writeResume } from "./progress"
import { useSleepTimer } from "./sleep-timer"
import { usePlayback } from "./state"

const RESUME_WRITE_INTERVAL = 5000
const PROGRESS_SYNC_INTERVAL = 15000
const PROGRESS_PUBLISH_INTERVAL = 1000

const publish = throttled(PROGRESS_PUBLISH_INTERVAL, publishProgress)
const saveResume = throttled(RESUME_WRITE_INTERVAL, writeResume)
const sync = throttled(PROGRESS_SYNC_INTERVAL, syncCurrentProgress)

const persistNow = () => {
  publish.now()
  saveResume.now()
  sync.now()
}

const onEnded = () => {
  const timer = useSleepTimer.getState()
  if (timer.untilEndOfTrack) timer.clear()
  else nextTrack()
}

const useSleepTimerPause = () => {
  const endsAt = useSleepTimer(s => s.endsAt)

  useEffect(() => {
    if (!endsAt) return
    const timer = setTimeout(
      () => {
        audio.pause()
        useSleepTimer.getState().clear()
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

    const stored = readResume()
    if (!stored) return clearPlayerParam()

    queryClient
      .fetchQuery(queries.books.detail(stored.libraryId, stored.bookId))
      .then(book => {
        audio.setRate(stored.rate)
        if (!startBook(book, stored.libraryId, stored.positionSec * 1000, false)) {
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

// Mounted once: wires the audio element to progress persistence, auto advance and the sleep timer.
export const useMountPlayback = () => {
  const media = audio.element()

  useEvent(media, "timeupdate", () => {
    publish.tick()
    saveResume.tick()
    sync.tick()
  })
  useEvent(media, "pause", persistNow)
  useEvent(media, "seeked", persistNow)
  useEvent(media, "ratechange", saveResume.now)
  useEvent(media, "ended", onEnded)
  useEvent(window, "pagehide", persistNow)

  useSleepTimerPause()
  useRestorePlayback()
}
