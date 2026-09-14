import { Track, UUID } from "@thoth/client"
import { offline } from "@thoth/offline"
import { useLocalUrls } from "@thoth/offline/store"
import { isUUID } from "@thoth/utils/utils"

export const coverStreamUrl = (id: UUID) => `/api/stream/images/${id}`
export const trackStreamUrl = (id: UUID) => `/api/stream/audio/${id}`

export const trackSrc = (track: Track): string => offline.localUrl(track.id) ?? trackStreamUrl(track.id)

export const useCoverSrc = () => {
  const urls = useLocalUrls(state => state.urls)
  return (id: string | undefined): string | undefined => {
    if (!id) return undefined
    // For edits, it can also be a data url or a http url
    if (!isUUID(id)) return id
    return urls[id] ?? coverStreamUrl(id)
  }
}
