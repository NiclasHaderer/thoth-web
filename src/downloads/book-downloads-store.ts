import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { BookDetailed, UUID } from "@thoth/client"
import { idbStorage, persistKey } from "@thoth/client/persistence"
import type { LocalUrls, StoredFiles } from "./offline-book-files"

export type BookDownloadState = "downloading" | "ready" | "error"

export interface BookDownload {
  book: BookDetailed
  state: BookDownloadState
  progress: number
  files?: StoredFiles
}

export interface BookDownloadsState {
  entries: Record<UUID, BookDownload>
  // Blob URLs by track or cover id. Reading a file from disk is async, so they are created up front and kept here
  // for playback and covers to look up synchronously, without knowing which book a file belongs to.
  urls: LocalUrls
}

// Only finished downloads are persisted; their local URLs are recreated on every start.
export const useBookDownloads = create<BookDownloadsState>()(
  persist((): BookDownloadsState => ({ entries: {}, urls: {} }), {
    name: persistKey("downloads"),
    version: 1,
    storage: createJSONStorage(() => idbStorage),
    partialize: state => ({
      entries: Object.fromEntries(Object.entries(state.entries).filter(([, entry]) => entry.state === "ready")),
    }),
    merge: (persisted, current) => ({
      ...current,
      entries: { ...(persisted as Partial<BookDownloadsState> | undefined)?.entries, ...current.entries },
    }),
  })
)

export const localUrl = (id: UUID): string | undefined => useBookDownloads.getState().urls[id]
