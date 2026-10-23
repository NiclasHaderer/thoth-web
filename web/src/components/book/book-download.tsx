import { ArrowDownToLineIcon, CircleArrowDownIcon, TrashIcon } from "lucide-react"
import { FC } from "react"
import { toast } from "sonner"
import { Book, UUID } from "@thoth/client"
import { queryClient } from "@thoth/client/query-client"
import { DialogProps, openDialog } from "@thoth/components/dialogs"
import { menuItem } from "@thoth/components/generic/resource-actions"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@thoth/components/ui/alert-dialog"
import { DropdownMenuItem } from "@thoth/components/ui/dropdown-menu"
import { bookDownloads, useBookDownload } from "@thoth/downloads"
import { isDetailedBook } from "@thoth/models/model-typeguards"
import { queries } from "@thoth/queries/query-definitions"

const fraction = (progress: number) => Math.min(1, Math.max(0, progress))
export const percent = (progress: number) => Math.round(fraction(progress) * 100)

// The download store only learns about a book once its tracks are fetched; until then a second tap would start a
// second download of the same book.
const fetchingTracks = new Set<UUID>()

const withTracks = async (book: Book) =>
  isDetailedBook(book) ? book : queryClient.query(queries.books.detail(book.libraryId, book.id))

export const startDownload = async (book: Book) => {
  if (fetchingTracks.has(book.id)) return
  fetchingTracks.add(book.id)
  try {
    const detailed = await withTracks(book).finally(() => fetchingTracks.delete(book.id))
    await bookDownloads.download(detailed)
    toast.success(`Downloaded ${book.title}`)
  } catch (error) {
    toast.error(`Could not download ${book.title}: ${(error as Error).message}`)
  }
}

const RemoveDownloadDialog: FC<{ book: Book } & DialogProps> = ({ book, isOpen, onOpenChange }) => (
  <AlertDialog isOpen={isOpen} onOpenChange={onOpenChange}>
    <AlertDialogHeader>
      <AlertDialogTitle>Remove download?</AlertDialogTitle>
      <AlertDialogDescription>
        <span className="text-foreground font-medium">{book.title}</span> will be deleted from this device.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction variant="destructive" onPress={() => void bookDownloads.remove(book.id)}>
        Remove download
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialog>
)

const loadRemoveDownload = () => Promise.resolve(RemoveDownloadDialog)

export const confirmRemoveDownload = (book: Book) => openDialog(loadRemoveDownload, { book })

const RADIUS = 8
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export const DownloadRing: FC<{ progress: number; className?: string }> = ({ progress, className }) => (
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

export const BookDownloadItem: FC<{ book: Book }> = ({ book }) => {
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
      <DropdownMenuItem className={menuItem} onAction={() => confirmRemoveDownload(book)}>
        <TrashIcon className="text-muted-foreground size-5" />
        Remove download
      </DropdownMenuItem>
    )
  }

  return (
    <DropdownMenuItem className={menuItem} isDisabled={book.durationMs === 0} onAction={() => void startDownload(book)}>
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
