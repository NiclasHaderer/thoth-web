import { forwardRef } from "react"
import { Series } from "@thoth/client"
import { GenericPreview } from "@thoth/components/generic/generic-preview.tsx"

interface SeriesPreviewProps extends Series {
  size?: "small" | "normal"
  className?: string
}

export const SeriesPreview = forwardRef<HTMLAnchorElement, SeriesPreviewProps>(
  ({ size = "normal", className = "", ...series }, ref) => {
    return (
      <GenericPreview
        label={series.title}
        libraryId={series.libraryId}
        id={series.id}
        size={size}
        imageId={series.coverID}
        type="series"
        ref={ref}
        className={className}
      />
    )
  }
)
