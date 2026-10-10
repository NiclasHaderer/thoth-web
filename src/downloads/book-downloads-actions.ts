import { BookDetailed, UUID } from "@thoth/client"
import { BookDownload, BookDownloadsState, useBookDownloads } from "./book-downloads-store"
import type { OfflineBookFiles } from "./offline-book-files"
import { opfsOfflineBookFiles } from "./opfs-offline-book-files"

const offlineBookFiles: OfflineBookFiles = opfsOfflineBookFiles

const fileIds = (book: BookDetailed): UUID[] => [
  ...(book.coverID ? [book.coverID] : []),
  ...book.tracks.map(track => track.id),
]

const patchEntry = (bookId: UUID, patch: Partial<BookDownload>) =>
  useBookDownloads.setState(state => {
    const current = state.entries[bookId]
    return current ? { entries: { ...state.entries, [bookId]: { ...current, ...patch } } } : state
  })

const withoutBook = (state: BookDownloadsState, book: BookDetailed): Partial<BookDownloadsState> => {
  const entries = { ...state.entries }
  const urls = { ...state.urls }
  delete entries[book.id]
  for (const id of fileIds(book)) delete urls[id]
  return { entries, urls }
}

const hydrated = (): Promise<void> =>
  useBookDownloads.persist.hasHydrated()
    ? Promise.resolve()
    : new Promise(resolve => {
        const unsubscribe = useBookDownloads.persist.onFinishHydration(() => {
          unsubscribe()
          resolve()
        })
      })

const download = async (book: BookDetailed): Promise<void> => {
  useBookDownloads.setState(state => ({
    entries: { ...state.entries, [book.id]: { book, state: "downloading", progress: 0 } },
  }))
  try {
    const stored = await offlineBookFiles.download(book, progress => patchEntry(book.id, { progress }))
    if (!useBookDownloads.getState().entries[book.id]) return offlineBookFiles.remove(stored)
    const urls = await offlineBookFiles.open(stored)
    useBookDownloads.setState(state => ({
      entries: { ...state.entries, [book.id]: { book, state: "ready", progress: 1, files: stored } },
      urls: { ...state.urls, ...urls },
    }))
  } catch (error) {
    patchEntry(book.id, { state: "error" })
    throw error
  }
}

const remove = async (bookId: UUID): Promise<void> => {
  const entry = useBookDownloads.getState().entries[bookId]
  if (!entry) return
  useBookDownloads.setState(state => withoutBook(state, entry.book))
  if (entry.files) await offlineBookFiles.remove(entry.files)
}

const restore = async (): Promise<void> => {
  await hydrated()
  for (const entry of Object.values(useBookDownloads.getState().entries)) {
    if (!entry.files) continue
    const urls = await offlineBookFiles.open(entry.files).catch(() => undefined)
    useBookDownloads.setState(state => (urls ? { urls: { ...state.urls, ...urls } } : withoutBook(state, entry.book)))
  }

  const keep = Object.values(useBookDownloads.getState().entries).flatMap(entry => entry.files ?? [])
  await offlineBookFiles.prune(keep)
}

const reset = async (): Promise<void> => {
  useBookDownloads.setState(useBookDownloads.getInitialState(), true)
  useBookDownloads.persist.clearStorage()
  await offlineBookFiles.clearAll()
}

export const bookDownloads = { supported: offlineBookFiles.supported, download, remove, restore, reset }
