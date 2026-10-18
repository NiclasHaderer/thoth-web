import { ImageOffIcon, LibraryIcon, RotateCcwIcon, TrashIcon, XIcon } from "lucide-react"
import { FC, useEffect, useState } from "react"
import { UUID } from "@thoth/client"
import { percent, startDownload } from "@thoth/components/book/book-download"
import { Link } from "@thoth/components/link.tsx"
import { toRuntime } from "@thoth/components/track/track-time-format"
import { Button } from "@thoth/components/ui/button"
import { BookDownload, bookDownloads, useBookDownloads, useCoverSrc } from "@thoth/downloads"
import { formatBytes, pluralize } from "@thoth/utils/utils"

const STATE_ORDER: Record<BookDownload["state"], number> = { downloading: 0, error: 1, ready: 2 }

const byStateThenTitle = (a: BookDownload, b: BookDownload) =>
  STATE_ORDER[a.state] - STATE_ORDER[b.state] || a.book.title.localeCompare(b.book.title)

const useStorage = (usedBytes: number) => {
  const [storage, setStorage] = useState<{ free?: number; persisted?: boolean }>({})
  useEffect(() => {
    void Promise.all([navigator.storage.estimate(), navigator.storage.persisted()]).then(([estimate, persisted]) =>
      setStorage({
        free: estimate.quota !== undefined ? estimate.quota - (estimate.usage ?? 0) : undefined,
        persisted,
      })
    )
  }, [usedBytes])
  return storage
}

const DownloadStatus: FC<{ entry: BookDownload }> = ({ entry }) => {
  if (entry.state === "downloading") {
    return (
      <div className="flex items-center gap-2">
        <div className="bg-secondary/60 h-1.5 grow overflow-hidden rounded-full">
          <div
            className="bg-primary h-full origin-left transition-transform duration-200 ease-linear"
            style={{ transform: `scaleX(${percent(entry.progress) / 100})` }}
          />
        </div>
        <span className="text-muted-foreground w-9 text-right text-xs tabular-nums">{percent(entry.progress)}%</span>
      </div>
    )
  }

  if (entry.state === "error") return <span className="text-destructive text-xs">Download failed</span>

  const runtime = entry.book.tracks.reduce((sum, track) => sum + track.durationMs, 0) / 1000
  return (
    <span className="text-muted-foreground text-xs">
      {[entry.bytes !== undefined ? formatBytes(entry.bytes) : null, runtime ? toRuntime(runtime) : null]
        .filter(Boolean)
        .join(" - ")}
    </span>
  )
}

const DownloadRow: FC<{ entry: BookDownload }> = ({ entry }) => {
  const cover = useCoverSrc()
  const { book } = entry
  const href = `/libraries/${book.libraryId}/books/${book.id}`

  return (
    <li className="flex items-center gap-3 py-3">
      <Link
        href={href}
        aria-hidden
        tabIndex={-1}
        className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-black/45 shadow-md"
      >
        {book.coverID ? (
          <img className="size-full object-cover" src={cover(book.coverID)} alt="" />
        ) : (
          <ImageOffIcon className="text-muted-foreground absolute top-1/2 left-1/2 size-5 -translate-x-1/2 -translate-y-1/2" />
        )}
      </Link>

      <div className="flex min-w-0 grow flex-col gap-1">
        <Link href={href} className="truncate text-sm font-medium hover:underline focus-visible:underline">
          {book.title}
        </Link>
        {book.authors.length ? (
          <span className="text-muted-foreground truncate text-xs">
            {book.authors.map(author => author.name).join(", ")}
          </span>
        ) : null}
        <DownloadStatus entry={entry} />
      </div>

      {entry.state === "error" ? (
        <Button variant="ghost" size="icon" aria-label={`Retry ${book.title}`} onPress={() => void startDownload(book)}>
          <RotateCcwIcon />
        </Button>
      ) : null}
      <Button
        variant="ghost"
        size="icon"
        aria-label={entry.state === "downloading" ? `Cancel ${book.title}` : `Remove ${book.title}`}
        onPress={() => void bookDownloads.remove(book.id)}
      >
        {entry.state === "downloading" ? <XIcon /> : <TrashIcon />}
      </Button>
    </li>
  )
}

const DownloadList: FC<{ libraryId: UUID }> = ({ libraryId }) => {
  const [allLibraries, setAllLibraries] = useState(false)
  const entries = Object.values(useBookDownloads(state => state.entries))
  const otherLibraries = entries.some(entry => entry.book.libraryId !== libraryId)
  const downloads = entries.filter(entry => allLibraries || entry.book.libraryId === libraryId).sort(byStateThenTitle)
  const usedBytes = downloads.reduce((sum, entry) => sum + (entry.bytes ?? 0), 0)
  const { free, persisted } = useStorage(usedBytes)

  return (
    <>
      <div className="mb-4 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <h2 className="hidden truncate text-2xl font-bold md:block">Downloads</h2>
          <p className="text-muted-foreground text-xs md:text-sm">
            {pluralize(downloads.length, "book")} - {formatBytes(usedBytes)}
            {free !== undefined ? ` - ${formatBytes(free)} free` : null}
          </p>
        </div>
        {otherLibraries ? (
          <Button variant="ghost" size="sm" onPress={() => setAllLibraries(all => !all)}>
            <LibraryIcon />
            {allLibraries ? "All libraries" : "This library"}
          </Button>
        ) : null}
      </div>

      {persisted === false ? (
        <p className="text-muted-foreground mb-4 text-sm">
          Your browser may delete downloads when the device runs low on storage.
        </p>
      ) : null}

      {downloads.length ? (
        <ul className="divide-border divide-y">
          {downloads.map(entry => (
            <DownloadRow key={entry.book.id} entry={entry} />
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground text-sm">
          No downloads yet. Download a book from its page to listen to it offline.
        </p>
      )}
    </>
  )
}

export const DownloadListOutlet = ({ libraryId }: { libraryId: UUID }) =>
  bookDownloads.supported ? (
    <DownloadList libraryId={libraryId} />
  ) : (
    <p className="text-muted-foreground text-sm">This browser does not support downloads.</p>
  )
