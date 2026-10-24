import { forwardRef } from "react"
import { Author } from "@dewey/client"
import { GenericPreview } from "@dewey/components/generic/generic-preview.tsx"

interface AuthorProps extends Author {
  size?: "small" | "normal"
  className?: string
}

export const AuthorPreview = forwardRef<HTMLDivElement, AuthorProps>(
  ({ size = "normal", className = "", ...author }, ref) => {
    return (
      <GenericPreview
        size={size}
        label={author.name}
        libraryId={author.libraryId}
        id={author.id}
        imageId={author.imageID}
        ref={ref}
        type="authors"
        round={true}
        className={className}
      />
    )
  }
)
