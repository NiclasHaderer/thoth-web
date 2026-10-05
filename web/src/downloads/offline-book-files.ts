import type { BookDetailed, UUID } from "@thoth/client"

export type LocalUrls = Record<UUID, string>

export interface StoredFiles {
  dir: string
  names: Record<UUID, string>
}

export interface OfflineBookFiles {
  supported: boolean
  download: (book: BookDetailed, onProgress: (fraction: number) => void) => Promise<StoredFiles>
  open: (stored: StoredFiles) => Promise<LocalUrls>
  remove: (stored: StoredFiles) => Promise<void>
  clearAll: () => Promise<void>
  prune: (keep: StoredFiles[]) => Promise<void>
}
