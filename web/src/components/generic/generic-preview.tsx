import { ImageOffIcon, PlayIcon } from "lucide-react"
import { FC, forwardRef, ReactNode } from "react"
import { Link } from "@thoth/components/link.tsx"
import { getSizing } from "@thoth/utils/width.ts"

interface GenericPreviewProps {
  id: string
  libraryId: string
  label: string
  subtitle?: ReactNode
  imageId?: string
  stackImageIds?: string[]
  type: "books" | "series" | "authors"
  size: "small" | "normal"
  roundedPicture?: boolean
  className: string
  onPlay?: () => void
}

const STACK_POSITIONS = ["size-[86%] bottom-0 left-0", "size-[86%] top-[7%] right-[7%]", "size-[86%] top-0 right-0"]
const STACK_DIMMING = ["", "brightness-[.75]", "brightness-[.55]"]
const STACK_PLACEHOLDER_BG = ["bg-black/45", "bg-black/35", "bg-black/25"]

const CoverStack: FC<{ ids: string[]; alt: string }> = ({ ids, alt }) => {
  return (
    <>
      {[2, 1, 0].map(index =>
        ids[index] ? (
          <img
            key={index}
            loading="lazy"
            className={`absolute rounded-lg object-cover shadow-md ring-1 ring-black/40 transition-[filter] duration-200 ${STACK_POSITIONS[index]} ${STACK_DIMMING[index]} ${
              index === 0 ? "group-hover:brightness-110 group-focus-visible:brightness-110" : ""
            }`}
            src={`/api/stream/images/${ids[index]}`}
            alt={index === 0 ? alt : ""}
          />
        ) : (
          <div
            key={index}
            aria-hidden={index !== 0}
            className={`absolute rounded-lg shadow-[0_1px_5px_rgba(0,0,0,0.4)] ring-1 ring-white/10 ${STACK_POSITIONS[index]} ${STACK_PLACEHOLDER_BG[index]}`}
          >
            {index === 0 ? (
              <ImageOffIcon className="text-muted-foreground absolute top-1/2 left-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2" />
            ) : null}
          </div>
        )
      )}
    </>
  )
}

export const GenericPreview = forwardRef<HTMLDivElement, GenericPreviewProps>(
  ({ size, roundedPicture = false, stackImageIds, className, subtitle, onPlay, ...item }, ref) => {
    const { containerClasses, widthClasses, heightClasses } = getSizing(size)
    const roundedClasses = roundedPicture ? "rounded-full" : "rounded-xl"
    const labelCenter = roundedPicture ? "text-center" : "text-left"
    const href = `/libraries/${item.libraryId}/${item.type}/${item.id}`
    const stack = stackImageIds
    const imageId = item.imageId
    return (
      <div className={`${className} ${containerClasses}`} ref={ref}>
        <div className="group relative w-full">
          <Link className="block focus-visible:outline-none" href={href} aria-label={item.label}>
            <div
              className={`${widthClasses} ${heightClasses} ${roundedClasses} relative transition-shadow duration-200 ${
                stack
                  ? ""
                  : `group-hover:ring-primary group-focus-within:ring-primary group-focus-within:ring-2 group-hover:ring-2 ${
                      imageId
                        ? "bg-popover overflow-hidden shadow-md group-hover:shadow-xl group-focus-visible:shadow-xl"
                        : "overflow-hidden bg-black/45 shadow-[0_1px_5px_rgba(0,0,0,0.4)]"
                    }`
              }`}
            >
              {stack ? (
                <>
                  <CoverStack ids={stack} alt={item.label} />
                  <div
                    aria-hidden
                    className="ring-primary pointer-events-none absolute inset-0 rounded-xl opacity-0 ring-2 transition-opacity duration-200 group-focus-within:opacity-100 group-hover:opacity-100"
                  />
                </>
              ) : imageId ? (
                <img
                  loading="lazy"
                  className={`h-full w-full object-cover transition-[filter] duration-200 ${
                    onPlay ? "" : "group-hover:brightness-110 group-focus-visible:brightness-110"
                  }`}
                  src={`/api/stream/images/${imageId}`}
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
              className={`bg-primary text-primary-foreground pointer-events-none absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full opacity-0 shadow-lg transition duration-200 group-hover:pointer-events-auto group-hover:opacity-100 hover:scale-110 hover:brightness-125 focus-visible:pointer-events-auto focus-visible:opacity-100 focus-visible:outline-none ${
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
        {subtitle === undefined ? null : (
          <span
            className={`${widthClasses} ${labelCenter} text-foreground block min-h-[1lh] overflow-hidden pt-0.5 text-xs leading-tight text-ellipsis whitespace-nowrap opacity-55`}
          >
            {subtitle}
          </span>
        )}
      </div>
    )
  }
)
