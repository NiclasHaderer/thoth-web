import { forwardRef, Fragment } from "react"
import { Book } from "@thoth/client"
import { GenericPreview } from "@thoth/components/generic/generic-preview.tsx"
import { Link } from "@thoth/components/link.tsx"
import { playBookById, useBookProgress } from "@thoth/playback"

interface BookPreviewProps extends Book {
  size?: "small" | "normal"
  className?: string
}

export const BookPreview = forwardRef<HTMLDivElement, BookPreviewProps>(
  ({ size = "normal", className = "", ...book }, ref) => {
    const { finished, inProgress, fraction } = useBookProgress(book)
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
        onPlay={() => void playBookById(book.libraryId, book.id)}
      />
    )
  }
)
