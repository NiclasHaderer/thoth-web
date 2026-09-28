import {
  authorizationHeader,
  BookDetailed,
  renewedAuthorizationHeader,
  ThothApiError,
  Track,
  unwrap,
  UUID,
} from "@thoth/client"
import { coverStreamUrl, trackStreamUrl } from "@thoth/client/media-urls"
import { slug } from "@thoth/utils/utils"
import type { OfflineBookFiles, LocalUrls, StoredFiles } from "./offline-book-files"
import type { WorkerReply, WorkerRequest } from "./opfs-file-writer-protocol"

const ROOT = "books"

const nameFor = (label: string, id: UUID) => `${slug(label)}--${id}`

const trackFileName = (track: Track) => nameFor(`${String(track.trackNr).padStart(2, "0")} ${track.title}`, track.id)

const supported =
  typeof navigator !== "undefined" &&
  typeof navigator.storage?.getDirectory === "function" &&
  typeof Worker !== "undefined"

const opened = new Map<string, LocalUrls>()

const close = (dir: string) => {
  Object.values(opened.get(dir) ?? {}).forEach(url => URL.revokeObjectURL(url))
  opened.delete(dir)
}

const inProgressWrites = new Set<string>()

type Outcome = "done" | "unauthorized"

let worker: Worker | undefined
let nextRequestId = 1
const pending = new Map<
  number,
  { resolve: (outcome: Outcome) => void; reject: (error: Error) => void; onProgress: (fraction: number) => void }
>()

const fileWriter = () => {
  if (worker) return worker
  worker = new Worker(new URL("./opfs-file-writer.worker.ts", import.meta.url), { type: "module" })
  worker.addEventListener("message", (event: MessageEvent<WorkerReply>) => {
    const reply = event.data
    const request = pending.get(reply.id)
    if (!request) return
    if (reply.type === "progress") return request.onProgress(reply.fraction)
    pending.delete(reply.id)
    if (reply.type === "error") request.reject(new Error(reply.error))
    else request.resolve(reply.type)
  })
  return worker
}

const ask = (request: Omit<WorkerRequest, "id">, onProgress: (fraction: number) => void): Promise<Outcome> => {
  const id = nextRequestId++
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject, onProgress })
    fileWriter().postMessage({ ...request, id })
  })
}

const booksDir = async (create: boolean) =>
  navigator.storage.getDirectory().then(root => root.getDirectoryHandle(ROOT, { create }))

const downloadFile = async (
  dir: string,
  name: string,
  url: string,
  onProgress: (fraction: number) => void
): Promise<void> => {
  const request = { url, dir: [ROOT, dir], name }
  const outcome = await ask({ ...request, authorization: await unwrap(authorizationHeader()) }, onProgress)
  if (outcome === "done") return

  const retry = await ask({ ...request, authorization: await unwrap(renewedAuthorizationHeader()) }, onProgress)
  if (retry !== "done") throw new ThothApiError({ success: false, error: "Session expired", status: 401 })
}

const download = async (book: BookDetailed, onProgress: (fraction: number) => void): Promise<StoredFiles> => {
  if (!supported) throw new Error("Downloads are not supported in this browser")
  await navigator.storage.persist().catch(() => false)
  const stored: StoredFiles = { dir: nameFor(book.title, book.id), names: {} }
  inProgressWrites.add(stored.dir)

  const save = async (id: UUID, name: string, url: string, onFileProgress: (fraction: number) => void) => {
    await downloadFile(stored.dir, name, url, onFileProgress)
    stored.names[id] = name
  }

  try {
    if (book.coverID) await save(book.coverID, nameFor("cover", book.coverID), coverStreamUrl(book.coverID), () => {})

    const totalDuration = book.tracks.reduce((sum, track) => sum + track.durationMs, 0) || 1
    let doneFraction = 0
    for (const track of book.tracks) {
      const weight = track.durationMs / totalDuration
      await save(track.id, trackFileName(track), trackStreamUrl(track.id), inFile =>
        onProgress(doneFraction + weight * inFile)
      )
      doneFraction += weight
      onProgress(doneFraction)
    }
    return stored
  } finally {
    inProgressWrites.delete(stored.dir)
  }
}

const open = async (stored: StoredFiles): Promise<LocalUrls> => {
  const cached = opened.get(stored.dir)
  if (cached) return cached

  const dir = await booksDir(false).then(books => books.getDirectoryHandle(stored.dir))
  const urls: LocalUrls = {}
  for (const [id, name] of Object.entries(stored.names))
    urls[id as UUID] = URL.createObjectURL(await dir.getFileHandle(name).then(handle => handle.getFile()))
  opened.set(stored.dir, urls)
  return urls
}

const remove = async (stored: StoredFiles): Promise<void> => {
  close(stored.dir)
  await booksDir(false)
    .then(books => books.removeEntry(stored.dir, { recursive: true }))
    .catch(() => undefined)
}

const clearAll = async (): Promise<void> => {
  for (const location of [...opened.keys()]) close(location)
  if (!supported) return
  await navigator.storage
    .getDirectory()
    .then(root => root.removeEntry(ROOT, { recursive: true }))
    .catch(() => undefined)
}

const prune = async (keep: StoredFiles[]): Promise<void> => {
  if (!supported) return
  const kept = new Set([...keep.map(stored => stored.dir), ...inProgressWrites])
  const books = await booksDir(true)
  const orphans: string[] = []
  for await (const [name] of books.entries()) if (!kept.has(name)) orphans.push(name)
  await Promise.all(orphans.map(name => books.removeEntry(name, { recursive: true }).catch(() => undefined)))
}

export const opfsOfflineBookFiles: OfflineBookFiles = { supported, download, open, remove, clearAll, prune }
