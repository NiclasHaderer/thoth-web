import type { BookDetailed, UUID } from "@thoth/client"

export interface OfflineBackend {
  supported: boolean
  download: (book: BookDetailed) => Promise<void>
  remove: (bookId: UUID) => Promise<void>
  clearAll: () => Promise<void>
  reconcile: () => Promise<void>
}
