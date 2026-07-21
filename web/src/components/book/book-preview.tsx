import { forwardRef, Fragment } from "react"
import { Link } from "wouter"
import { Book } from "@thoth/client"
import { GenericPreview } from "@thoth/components/generic/generic-preview.tsx"

interface BookPreviewProps extends Book {
  size?: "small" | "normal"
  className?: string
}

export const BookPreview = forwardRef<HTMLAnchorElement, BookPreviewProps>(
  ({ size = "normal", className = "", ...book }, ref) => {
    return (
      <GenericPreview
        size={size}
        label={book.title}
        subtitle={book.authors.map((author, i) => (
          <Fragment key={author.id}>
            {i > 0 ? ", " : null}
            <Link
              href={`/libraries/${book.library.id}/authors/${author.id}`}
              className="hover:underline focus-visible:underline focus-visible:outline-none"
            >
              {author.name}
            </Link>
          </Fragment>
        ))}
        libraryId={book.library.id}
        id={book.id}
        imageId={book.coverID}
        ref={ref}
        className={className}
        type="books"
      />
    )
  }
)
