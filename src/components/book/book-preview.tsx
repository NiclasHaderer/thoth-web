import { forwardRef } from "react"
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
