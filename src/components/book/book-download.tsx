import { ArrowDownToLineIcon, CircleArrowDownIcon, TrashIcon } from "lucide-react"
import { FC } from "react"
import { toast } from "sonner"
import { BookDetailed, UUID } from "@thoth/client"
import { DropdownMenuItem } from "@thoth/components/ui/dropdown-menu"
import { bookDownloads, useBookDownload } from "@thoth/downloads"

const menuItem = "gap-2.5 rounded-lg px-2.5 py-2 text-sm"

const fraction = (progress: number) => Math.min(1, Math.max(0, progress))
const percent = (progress: number) => Math.round(fraction(progress) * 100)

const RADIUS = 8
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const DownloadRing: FC<{ progress: number; className?: string }> = ({ progress, className }) => (
  <svg className={className} fill="none" viewBox="0 0 20 20">
    <circle cx="10" cy="10" r={RADIUS} stroke="currentColor" strokeOpacity={0.25} strokeWidth={2.5} />
    <circle
      className="origin-center -rotate-90 transition-[stroke-dashoffset] duration-200 ease-linear"
      cx="10"
      cy="10"
      r={RADIUS}
      stroke="currentColor"
      strokeDasharray={CIRCUMFERENCE}
      strokeDashoffset={CIRCUMFERENCE * (1 - fraction(progress))}
      strokeLinecap="round"
      strokeWidth={2.5}
    />
  </svg>
)

export const BookDownloadItem: FC<{ book: BookDetailed }> = ({ book }) => {
  const entry = useBookDownload(book.id)
  if (!bookDownloads.supported) return null

  if (entry?.state === "downloading") {
    return (
      <DropdownMenuItem className={menuItem} isDisabled>
        <DownloadRing className="text-muted-foreground size-5" progress={entry.progress} />
        Downloading {percent(entry.progress)}%
      </DropdownMenuItem>
    )
  }

  if (entry?.state === "ready") {
    return (
      <DropdownMenuItem className={menuItem} onAction={() => void bookDownloads.remove(book.id)}>
        <TrashIcon className="text-muted-foreground size-5" />
        Remove download
      </DropdownMenuItem>
    )
  }

  return (
    <DropdownMenuItem
      className={menuItem}
      isDisabled={book.tracks.length === 0}
      onAction={() => {
        bookDownloads
          .download(book)
          .then(() => toast.success(`Downloaded ${book.title}`))
          .catch((error: Error) => toast.error(`Could not download ${book.title}: ${error.message}`))
      }}
    >
      <ArrowDownToLineIcon className="text-muted-foreground size-5" />
      {entry?.state === "error" ? "Retry download" : "Download"}
    </DropdownMenuItem>
  )
}

export const DownloadBadge: FC<{ bookId: UUID; size?: "small" | "normal" }> = ({ bookId, size = "normal" }) => {
  const entry = useBookDownload(bookId)
  if (!entry || entry.state === "error") return null

  const box = size === "small" ? "size-8" : "size-11"
  const icon = size === "small" ? "size-3.5" : "size-5"

  return (
    <div
      aria-label={entry.state === "ready" ? "Downloaded" : `Downloading ${percent(entry.progress)}%`}
      className={`absolute top-0 left-0 flex ${box} items-center justify-center rounded-br-lg bg-black/55 text-white/90 backdrop-blur-sm`}
    >
      {entry.state === "ready" ? (
        <CircleArrowDownIcon className={icon} strokeWidth={2.5} />
      ) : (
        <DownloadRing className={icon} progress={entry.progress} />
      )}
    </div>
  )
}
