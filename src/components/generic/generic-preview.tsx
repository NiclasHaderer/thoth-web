import { ImageOffIcon, PlayIcon } from "lucide-react"
import { forwardRef, ReactNode } from "react"
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
  onPlay?: () => void
}

export const GenericPreview = forwardRef<HTMLDivElement, GenericPreviewProps>(
  ({ size, roundedPicture = false, className, subtitle, onPlay, ...item }, ref) => {
    const { containerClasses, widthClasses, heightClasses } = getSizing(size)
    const roundedClasses = roundedPicture ? "rounded-full" : "rounded-xl"
    const labelCenter = roundedPicture ? "text-center" : "text-left"
    const href = `/libraries/${item.libraryId}/${item.type}/${item.id}`
    return (
      <div className={`${className} ${containerClasses}`} ref={ref}>
        <div className="group relative w-full">
          <Link className="block focus-visible:outline-none" href={href} aria-label={item.label}>
            <div
              className={`${widthClasses} ${heightClasses} ${roundedClasses} group-hover:ring-primary group-focus-within:ring-primary relative overflow-hidden transition-shadow duration-200 group-focus-within:ring-2 group-hover:ring-2 ${
                item.imageId
                  ? "bg-popover shadow-md group-hover:shadow-xl group-focus-visible:shadow-xl"
                  : "bg-black/45 shadow-[0_1px_5px_rgba(0,0,0,0.4)]"
              }`}
            >
              {item.imageId ? (
                <img
                  loading="lazy"
                  className={`h-full w-full object-cover transition-[filter] duration-200 ${
                    onPlay ? "" : "group-hover:brightness-110 group-focus-visible:brightness-110"
                  }`}
                  src={`/api/stream/images/${item.imageId}`}
                  alt={item.label}
                />
              ) : (
                <ImageOffIcon className="text-muted-foreground absolute top-1/2 left-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2" />
              )}
              {onPlay ? (
                <div className="pointer-events-none absolute inset-0 bg-black/45 opacity-0 transition-opacity duration-200 group-focus-within:opacity-100 group-hover:opacity-100" />
              ) : null}
            </div>
          </Link>

          {onPlay ? (
            <button
              type="button"
              aria-label={`Play ${item.label}`}
              onClick={onPlay}
              className={`bg-primary text-primary-foreground absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full opacity-0 shadow-lg transition duration-200 group-hover:opacity-100 hover:scale-110 hover:brightness-125 focus-visible:opacity-100 focus-visible:outline-none ${
                size === "small" ? "size-11" : "size-14"
              }`}
            >
              <PlayIcon className="size-1/2 translate-x-[5%] fill-current" />
            </button>
          ) : null}
        </div>

        <Link
          href={href}
          tabIndex={-1}
          aria-hidden
          className={`${widthClasses} ${labelCenter} text-foreground block overflow-hidden pt-2 text-sm leading-tight font-medium text-ellipsis whitespace-nowrap hover:underline`}
        >
          {item.label}
        </Link>
        {subtitle ? (
          <span
            className={`${widthClasses} ${labelCenter} text-foreground block overflow-hidden pt-0.5 text-xs leading-tight text-ellipsis whitespace-nowrap opacity-55`}
          >
            {subtitle}
          </span>
        ) : null}
      </div>
    )
  }
)
