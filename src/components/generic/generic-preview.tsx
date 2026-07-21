import { forwardRef, ReactNode } from "react"
import { CiImageOff } from "react-icons/ci"
import { Link } from "wouter"
import { getSizing } from "@thoth/utils/width.ts"

interface GenericPreviewProps {
  id: string
  libraryId: string
  label: string
  subtitle?: ReactNode
  imageId?: string
  type: "books" | "series" | "authors"
  size: "small" | "normal"
  roundedPicture?: boolean
  className: string
}

export const GenericPreview = forwardRef<HTMLAnchorElement, GenericPreviewProps>(
  ({ size, roundedPicture = false, className, subtitle, ...item }, ref) => {
    const { widthClasses, heightClasses } = getSizing(size)
    const roundedClasses = roundedPicture ? "rounded-full" : "rounded-md"
    const labelCenter = roundedPicture ? "text-center" : "text-left"
    return (
      <div className={`${className} inline-block`}>
        <Link
          className="group block focus-visible:outline-none"
          ref={ref}
          href={`/libraries/${item.libraryId}/${item.type}/${item.id}`}
          aria-label={item.label}
        >
          <div
            className={`${widthClasses} ${heightClasses} ${roundedClasses} bg-elevate-2 relative overflow-hidden shadow-md transition-shadow duration-200 group-hover:shadow-xl group-focus-visible:shadow-xl`}
          >
            {item.imageId ? (
              <img
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105 group-focus-visible:scale-105"
                src={`/api/stream/images/${item.imageId}`}
                alt={item.label}
              />
            ) : (
              <CiImageOff className="text-elevate-4 absolute top-1/2 left-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2" />
            )}
          </div>

          <span
            className={`${widthClasses} ${labelCenter} text-font block overflow-hidden pt-1 pl-1 text-sm text-ellipsis whitespace-nowrap group-hover:underline group-focus-visible:underline`}
          >
            {item.label}
          </span>
        </Link>
        {subtitle ? (
          <span
            className={`${widthClasses} ${labelCenter} text-font block overflow-hidden pl-1 text-xs text-ellipsis whitespace-nowrap opacity-55`}
          >
            {subtitle}
          </span>
        ) : null}
      </div>
    )
  }
)
