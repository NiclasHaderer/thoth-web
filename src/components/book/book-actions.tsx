import { CircleCheckIcon, CirclePlayIcon, RotateCcwIcon } from "lucide-react"
import { FC } from "react"
import { Book } from "@thoth/client"
import { BookDownloadItem } from "@thoth/components/book/book-download"
import { openDialog } from "@thoth/components/dialogs"
import { menuItem, ResourceActions } from "@thoth/components/generic/resource-actions"
import { DropdownMenuItem } from "@thoth/components/ui/dropdown-menu"
import { useCanPlay } from "@thoth/downloads"
import { playback, usePlayback } from "@thoth/playback"
import { useAutoMatchBook, useResetBookProgress, useSetBookFinished } from "@thoth/queries/resource-queries"

export const useBookActions = (book: Book) => {
  const isCurrentBook = usePlayback(s => s.book?.id === book.id)
  const isPlaying = usePlayback(s => !s.paused)
  const canPlay = useCanPlay(book.id)
  const setFinished = useSetBookFinished()
  const resetProgress = useResetBookProgress()
  const target = { libraryId: book.libraryId, bookId: book.id }
  const isFinished = book.status === "FINISHED"
  const inProgress = book.status === "IN_PROGRESS" && book.durationMs > 0

  return {
    play: {
      label: isCurrentBook || inProgress ? "Resume" : "Play",
      isDisabled: book.durationMs === 0 || !canPlay,
      run: () => void playback.play(target),
    },
    finished: {
      isFinished,
      label: isFinished ? "Mark as unplayed" : "Mark as played",
      isDisabled: setFinished.isPending,
      run: () => setFinished.mutate({ libraryId: book.libraryId, id: book.id, finished: !isFinished }),
    },
    resetProgress: {
      label: "Reset progress",
      isDisabled: resetProgress.isPending || (book.positionMs === 0 && book.status === "UNPLAYED"),
      run: () => {
        resetProgress.mutate({ libraryId: book.libraryId, id: book.id })
        // Otherwise the running playback keeps its position and syncs it straight back.
        if (isCurrentBook) void playback.play(target, { at: 0, autoplay: isPlaying })
      },
    },
  }
}

// Every book tile renders this menu, so the editor is only fetched on first use instead of joining the first-load
// bundle.
const loadBookEdit = () => import("./book-edit").then(module => module.BookEdit)

export const BookActionsMenu: FC<{
  book: Book
  // The book page shows play and played as buttons next to the menu; everywhere else they live in it.
  withPlayback?: boolean
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  triggerClassName?: string
}> = ({ book, withPlayback = false, isOpen, onOpenChange, triggerClassName }) => {
  const actions = useBookActions(book)
  const autoMatch = useAutoMatchBook()

  return (
    <ResourceActions
      libraryId={book.libraryId}
      id={book.id}
      label="book"
      autoMatch={autoMatch}
      onEdit={() => openDialog(loadBookEdit, { book })}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      triggerClassName={triggerClassName}
      placement="bottom start"
      leading={
        withPlayback ? (
          <>
            <DropdownMenuItem className={menuItem} isDisabled={actions.play.isDisabled} onAction={actions.play.run}>
              <CirclePlayIcon className="text-muted-foreground size-5" />
              {actions.play.label}
            </DropdownMenuItem>
            <DropdownMenuItem
              className={menuItem}
              isDisabled={actions.finished.isDisabled}
              onAction={actions.finished.run}
            >
              <CircleCheckIcon className="text-muted-foreground size-5" />
              {actions.finished.label}
            </DropdownMenuItem>
          </>
        ) : null
      }
    >
      <DropdownMenuItem
        className={menuItem}
        isDisabled={actions.resetProgress.isDisabled}
        onAction={actions.resetProgress.run}
      >
        <RotateCcwIcon className="text-muted-foreground size-5" />
        {actions.resetProgress.label}
      </DropdownMenuItem>
      <BookDownloadItem book={book} />
    </ResourceActions>
  )
}
