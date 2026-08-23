import { forwardRef } from "react"
import { Series } from "@thoth/client"
import { GenericPreview } from "@thoth/components/generic/generic-preview.tsx"
import { notNullIsh, unique } from "@thoth/utils/utils"

interface SeriesPreviewProps extends Series {
  size?: "small" | "normal"
  className?: string
}

export const SeriesPreview = forwardRef<HTMLDivElement, SeriesPreviewProps>(
  ({ size = "normal", className = "", ...series }, ref) => {
    return (
      <GenericPreview
        label={series.title}
        libraryId={series.libraryId}
        id={series.id}
        size={size}
        stackImageIds={unique([series.coverID, ...series.bookCoverIDs].filter(notNullIsh))}
        type="series"
        ref={ref}
        className={className}
      />
    )
  }
)
