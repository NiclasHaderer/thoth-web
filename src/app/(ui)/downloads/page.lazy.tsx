import { cn } from "cn"
import { ArrowDownToLineIcon, ImageOffIcon, RotateCcwIcon, TrashIcon, XIcon } from "lucide-react"
import { FC } from "react"
import { BookActionsMenu, BookContextMenu } from "@thoth/components/book/book-actions"
import { confirmRemoveDownload, percent, startDownload } from "@thoth/components/book/book-download"
import { Link } from "@thoth/components/link.tsx"
import { toRuntime } from "@thoth/components/track/track-time-format"
import { Button } from "@thoth/components/ui/button"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@thoth/components/ui/empty"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@thoth/components/ui/item"
import { Progress, ProgressValue } from "@thoth/components/ui/progress"
import { BookDownload, bookDownloads, useBookDownloads, useCoverSrc } from "@thoth/downloads"
import { StorageUsage, useStorageUsage } from "@thoth/hooks/use-storage-usage"
import { useBook } from "@thoth/queries/resource-queries"
import { formatGigabytes, pluralize } from "@thoth/utils/utils"

const STATE_ORDER: Record<BookDownload["state"], number> = { downloading: 0, error: 1, ready: 2 }

const StorageBar: FC<{ downloadBytes: number; storage: StorageUsage }> = ({ downloadBytes, storage }) => {
  const available = Math.max(0, storage.quota - storage.usage)
  const legend = [
    { label: "Downloads", bytes: downloadBytes, color: "bg-primary" },
    { label: "Available", bytes: available, color: "bg-muted" },
  ]

  return (
    <div className="flex flex-col gap-2">
      <Progress
        aria-label="Storage used by downloads"
        value={downloadBytes}
        maxValue={downloadBytes + available || 1}
      />
      <ul className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 text-xs">
        {legend.map(entry => (
          <li key={entry.label} className="flex items-center gap-1.5">
            <span aria-hidden className={cn("size-2 rounded-full", entry.color)} />
            {entry.label} <span className="text-foreground tabular-nums">{formatGigabytes(entry.bytes)}</span>
          </li>
        ))}
      </ul>
      {storage.persisted ? null : (
        <p className="text-muted-foreground text-xs">
          Your browser may delete downloads when the device runs low on storage.
        </p>
      )}
    </div>
  )
}

const DownloadStatus: FC<{ entry: BookDownload }> = ({ entry }) => {
  if (entry.state === "downloading") {
    return (
      <Progress
        aria-label="Download progress"
        value={percent(entry.progress)}
        className="flex-nowrap items-center gap-2"
      >
        <ProgressValue className="order-last ml-0 w-9 text-right text-xs" />
      </Progress>
    )
  }

  if (entry.state === "error") return <span className="text-destructive text-xs">Download failed</span>

  const runtime = entry.book.tracks.reduce((sum, track) => sum + track.durationMs, 0) / 1000
  return (
    <span className="text-muted-foreground text-xs">
      {[entry.bytes !== undefined ? formatGigabytes(entry.bytes) : null, runtime ? toRuntime(runtime) : null]
        .filter(Boolean)
        .join(" - ")}
    </span>
  )
}

const DownloadRow: FC<{ entry: BookDownload }> = ({ entry }) => {
  const cover = useCoverSrc()
  // The entry holds the book as it was when downloaded; the menu needs its current play state.
  const book = useBook(entry.book.libraryId, entry.book.id).data ?? entry.book
  const href = `/libraries/${book.libraryId}/books/${book.id}`

  return (
    <div role="listitem" className="-mx-3 select-none [-webkit-touch-callout:none]">
      <Item className="no-touch:hover:bg-muted has-[a:active]:bg-muted has-[a:focus-visible]:ring-ring/50 relative has-[a:focus-visible]:ring-3">
        <ItemMedia variant="image" className="relative size-14 rounded-lg bg-black/45">
          {book.coverID ? (
            <img src={cover(book.coverID)} alt="" />
          ) : (
            <ImageOffIcon className="text-muted-foreground size-5" />
          )}
        </ItemMedia>

        <ItemContent className="min-w-0">
          <ItemTitle className="w-auto">
            {/* An item cannot be a link with buttons inside, so the title's ::after stretches the link over the whole
              row, which also makes the whole row the context menu target; the actions are relative so they stay on
              top. */}
            <BookContextMenu
              book={book}
              target={
                <Link href={href} className="truncate outline-none after:absolute after:inset-0">
                  {book.title}
                </Link>
              }
            />
          </ItemTitle>
          {book.authors.length ? (
            <ItemDescription className="line-clamp-1 text-xs">
              {book.authors.map(author => author.name).join(", ")}
            </ItemDescription>
          ) : null}
          <DownloadStatus entry={entry} />
        </ItemContent>

        <ItemActions className="gap-0">
          {entry.state === "error" ? (
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              aria-label={`Retry ${book.title}`}
              onPress={() => void startDownload(book)}
            >
              <RotateCcwIcon />
            </Button>
          ) : null}
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label={entry.state === "downloading" ? `Cancel ${book.title}` : `Remove ${book.title}`}
            onPress={() => (entry.state === "ready" ? confirmRemoveDownload(book) : void bookDownloads.remove(book.id))}
          >
            {entry.state === "downloading" ? <XIcon /> : <TrashIcon />}
          </Button>
          <BookActionsMenu
            book={book}
            withPlayback
            triggerClassName="touch:hidden opacity-0 group-hover/item:opacity-100 aria-expanded:opacity-100 relative h-8! focus-visible:opacity-100 sm:h-8! [&_svg]:size-4!"
          />
        </ItemActions>
      </Item>
    </div>
  )
}

const DownloadList: FC = () => {
  const downloads = Object.values(useBookDownloads(state => state.entries)).sort(
    (a, b) => STATE_ORDER[a.state] - STATE_ORDER[b.state] || a.book.title.localeCompare(b.book.title)
  )
  const downloadBytes = downloads.reduce((sum, entry) => sum + (entry.bytes ?? 0), 0)
  const storage = useStorageUsage(downloadBytes)

  return (
    <div className="-mb-4 flex grow flex-col max-md:pt-4">
      <div className="mb-4 flex min-w-0 items-baseline gap-3">
        <h2 className="shrink-0 text-2xl font-bold">Downloads</h2>
        <p className="text-muted-foreground truncate text-xs md:text-sm">{pluralize(downloads.length, "book")}</p>
      </div>

      {downloads.length ? (
        <ItemGroup className="gap-1">
          {downloads.map(entry => (
            <DownloadRow key={entry.book.id} entry={entry} />
          ))}
        </ItemGroup>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ArrowDownToLineIcon />
            </EmptyMedia>
            <EmptyTitle>No downloads yet</EmptyTitle>
            <EmptyDescription>Download a book from its menu to listen to it offline.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      {storage ? (
        // Sticky insets by the scroll surface's padding; -bottom-4 here and -mb-4 on the wrapper cancel its pb-4, so
        // the bar sits flush at the bottom whether the list is short or scrolling, and no rows show beneath it. On
        // mobile that padding also covers the tab bar, which keeps the bar above it.
        <div className="bg-background sticky -bottom-4 -mx-5 mt-auto px-5 pt-4 pb-4">
          <StorageBar downloadBytes={downloadBytes} storage={storage} />
        </div>
      ) : null}
    </div>
  )
}

export const DownloadListOutlet = () =>
  bookDownloads.supported ? (
    <DownloadList />
  ) : (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ArrowDownToLineIcon />
        </EmptyMedia>
        <EmptyTitle>Downloads are not supported</EmptyTitle>
        <EmptyDescription>This browser cannot store books for offline listening.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
