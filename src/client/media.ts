import { UUID } from "@thoth/client"

export const coverStreamUrl = (id: UUID) => `/api/stream/images/${id}`
export const trackStreamUrl = (id: UUID) => `/api/stream/audio/${id}`
