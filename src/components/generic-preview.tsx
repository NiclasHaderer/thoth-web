import { forwardRef } from "react"
import { CiImageOff } from "react-icons/ci"
import { Link } from "wouter"
import { getSizing } from "@thoth/utils/width.ts"

interface GenericPreviewProps {
  id: string
  libraryId: string
  label: string
  imageId?: string
  type: "books" | "series" | "authors"
  size: "small" | "normal"
  roundedPicture?: boolean
  className: string
}

export const GenericPreview = forwardRef<HTMLAnchorElement, GenericPreviewProps>(
  ({ size, roundedPicture = false, className, ...item }, ref) => {
    const { widthClasses, heightClasses } = getSizing(size)
    const roundedClasses = roundedPicture ? "rounded-full" : "rounded-md"
    const labelCenter = roundedPicture ? "text-center" : "text-left"
    return (
      <Link
        className={`${className} whitespace-no group inline-block`}
        ref={ref}
        href={`/libraries/${item.libraryId}/${item.type}/${item.id}`}
        aria-label={item.label}
        tabIndex={-1}
      >
        {item.imageId ? (
          <img
            loading="lazy"
            className={`${widthClasses} ${heightClasses} ${roundedClasses}`}
            src={`/api/stream/images/${item.imageId}`}
            alt={item.label}
          />
        ) : (
          <div className={`${widthClasses} ${heightClasses} ${roundedClasses} relative bg-elevate-2`}>
            <CiImageOff className="text-elevate-4 absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2" />
          </div>
        )}

        <span
          className={`${widthClasses} ${labelCenter} block overflow-hidden text-ellipsis py-1 group-hover:underline`}
        >
          {item.label}
        </span>
      </Link>
    )
  }
)

//
