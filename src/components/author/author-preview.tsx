import { forwardRef } from "react"
import { AuthorModel } from "@thoth/client"
import { GenericPreview } from "@thoth/components/generic-preview.tsx"

interface AuthorProps extends AuthorModel {
  size?: "small" | "normal"
  className?: string
}

export const AuthorPreview = forwardRef<HTMLDivElement, AuthorProps>(
  ({ size = "normal", className = "", ...author }, ref) => {
    return (
      <GenericPreview
        size={size}
        label={author.name}
        libraryId={author.library.id}
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
