import { useEffect } from "react"
import { Track } from "@thoth/client"
import { trackStreamUrl } from "@thoth/client/media"
import type { OfflineBackend } from "./backend"
import { localUrl } from "./store"
import { webOfflineBackend } from "./web-store"

export const offline: OfflineBackend = webOfflineBackend

export const trackSrc = (track: Track): string => localUrl(track.id) ?? trackStreamUrl(track.id)

export const useReconcileDownloads = () => {
  useEffect(() => void offline.reconcile(), [])
}

export { localUrl } from "./store"
export * from "./hooks"
export type { DownloadEntry, DownloadState } from "./store"
