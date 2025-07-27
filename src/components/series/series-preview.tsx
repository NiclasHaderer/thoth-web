import { forwardRef } from "react"
import { MdImageNotSupported } from "react-icons/md"
import { Link } from "wouter"
import { SeriesModel } from "@thoth/client"

export const SeriesPreview = forwardRef<HTMLSpanElement, SeriesModel>((series, ref) => {
  return (
    <span className="mx-6 mb-6 inline-block w-52" ref={ref}>
      <Link href={`/libraries/${series.library.id}/series/${series.id}`} aria-label={series.title} tabIndex={-1}>
        {series.coverID ? (
          <img
            loading="lazy"
            className="h-52 w-52 cursor-pointer rounded-md border-2 border-transparent transition-colors hover:border-primary"
            src={`/api/stream/image/${series.coverID}`}
            alt="Series"
          />
        ) : (
          <MdImageNotSupported className="h-52 w-52 cursor-pointer rounded-md border-2 border-transparent transition-colors hover:border-primary" />
        )}
      </Link>

      <div className="relative p-2 text-center">
        <Link href={`/libraries/${series.library.id}/series/${series.id}`}>
          <span className="line-clamp-2 cursor-pointer hover:underline no-touch:group-focus:underline">
            {series.title}
          </span>
        </Link>
        {/*TODO amount*/}
        {/*<span className="text-font-secondary">{amount} Audiobooks</span>*/}
      </div>
    </span>
  )
})
