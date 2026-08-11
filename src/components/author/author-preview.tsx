import { forwardRef } from "react"
import { Author } from "@thoth/client"
import { GenericPreview } from "@thoth/components/generic/generic-preview.tsx"

interface AuthorProps extends Author {
  size?: "small" | "normal"
  className?: string
}

export const AuthorPreview = forwardRef<HTMLAnchorElement, AuthorProps>(
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
        roundedPicture={true}
        className={className}
      />
    )
  }
)
