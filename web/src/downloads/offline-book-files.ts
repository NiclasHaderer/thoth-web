import type { BookDetailed, UUID } from "@dewey/client"

export type LocalUrls = Record<UUID, string>

export interface StoredFiles {
  dir: string
  names: Record<UUID, string>
}

export interface OpenedFiles {
  urls: LocalUrls
  bytes: number
}

export interface OfflineBookFiles {
  supported: boolean
  download: (book: BookDetailed, onProgress: (fraction: number) => void) => Promise<StoredFiles>
  open: (stored: StoredFiles) => Promise<OpenedFiles>
  remove: (stored: StoredFiles) => Promise<void>
  clearAll: () => Promise<void>
  prune: (keep: StoredFiles[]) => Promise<void>
}
