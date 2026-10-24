import { forwardRef, Fragment } from "react"
import { Book } from "@dewey/client"
import { BookActionsMenu, BookContextMenu } from "@dewey/components/book/book-actions"
import { DownloadBadge } from "@dewey/components/book/book-download"
import { GenericPreview } from "@dewey/components/generic/generic-preview.tsx"
import { Link } from "@dewey/components/link.tsx"
import { useCanPlay } from "@dewey/downloads"
import { playback, useBookProgress } from "@dewey/playback"

interface BookPreviewProps extends Book {
  size?: "small" | "normal"
  className?: string
}

export const BookPreview = forwardRef<HTMLDivElement, BookPreviewProps>(
  ({ size = "normal", className = "", ...book }, ref) => {
    const { finished, inProgress, fraction } = useBookProgress(book)
    const canPlay = useCanPlay(book.id)
    return (
      <GenericPreview
        size={size}
        label={book.title}
        subtitle={book.authors.map((author, i) => (
          <Fragment key={author.id}>
            {i > 0 ? ", " : null}
            <Link
              href={`/libraries/${book.libraryId}/authors/${author.id}`}
              className="hover:underline focus-visible:underline focus-visible:outline-none"
            >
              {author.name}
            </Link>
          </Fragment>
        ))}
        libraryId={book.libraryId}
        id={book.id}
        imageId={book.coverID}
        ref={ref}
        className={className}
        type="books"
        progress={inProgress ? fraction : undefined}
        finished={finished}
        badge={<DownloadBadge bookId={book.id} size="small" />}
        onPlay={canPlay ? () => void playback.play({ libraryId: book.libraryId, bookId: book.id }) : undefined}
        menu={
          <BookActionsMenu
            book={book}
            withPlayback
            // On touch the context menu (long press on the cover) replaces it.
            triggerClassName="touch:hidden no-touch:group-hover:opacity-100 absolute right-1 bottom-2 h-8! bg-transparent! text-white/80 opacity-0 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] hover:text-white focus-visible:opacity-100 aria-expanded:opacity-100 sm:h-8! [&_svg]:size-4!"
          />
        }
        contextMenu={target => <BookContextMenu book={book} target={target} />}
      />
    )
  }
)
