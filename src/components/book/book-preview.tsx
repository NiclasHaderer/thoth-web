import { forwardRef } from "react"
import { BookModel } from "@thoth/client"
import { GenericPreview } from "@thoth/components/generic-preview.tsx"

interface BookPreviewProps extends BookModel {
  size?: "small" | "normal"
  className?: string
}

export const BookPreview = forwardRef<HTMLDivElement, BookPreviewProps>(
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
