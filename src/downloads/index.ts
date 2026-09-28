import { Track } from "@thoth/client"
import { trackStreamUrl } from "@thoth/client/media-urls"
import { localUrl } from "./book-downloads-store"

export const trackSrc = (track: Track): string => localUrl(track.id) ?? trackStreamUrl(track.id)

export { bookDownloads } from "./book-downloads-actions"
export { BookDownloadsProvider } from "./book-downloads-provider"
export * from "./book-downloads-hooks"
export { localUrl, useBookDownloads, type BookDownload, type BookDownloadState } from "./book-downloads-store"
