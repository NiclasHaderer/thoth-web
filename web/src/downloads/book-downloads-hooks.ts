import { UUID } from "@thoth/client"
import { coverStreamUrl } from "@thoth/client/media-urls"
import { useOnline } from "@thoth/hooks/online-status"
import { isUUID } from "@thoth/utils/utils"
import { useBookDownloads } from "./book-downloads-store"

export const useCoverSrc = () => {
  const urls = useBookDownloads(state => state.urls)
  return (id: string | null | undefined): string | undefined => {
    if (!id) return undefined
    // For edits, it can also be a data url or a http url
    if (!isUUID(id)) return id
    return urls[id] ?? coverStreamUrl(id)
  }
}

export const useBookDownload = (bookId: UUID) => useBookDownloads(state => state.entries[bookId])

export const useDownloadedBook = (bookId: UUID) =>
  useBookDownloads(state => {
    const entry = state.entries[bookId]
    return entry?.state === "ready" ? entry.book : undefined
  })

export const useCanPlay = (bookId: UUID) => {
  const online = useOnline()
  const downloaded = useBookDownloads(state => state.entries[bookId]?.state === "ready")
  return online || downloaded
}
