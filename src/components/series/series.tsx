import React from "react"
import { MdImageNotSupported } from "react-icons/md"
import Link from "next/link"
import { useAudiobookState } from "@thoth/state/audiobook.state"
import { AudiobookSelectors } from "@thoth/state/audiobook.selectors"
import { SeriesModel } from "@thoth/client"

export const SeriesDisplay: React.FC<SeriesModel> = ({ id, title, coverID }) => {
  const seriesId = useAudiobookState(AudiobookSelectors.selectedLibraryId)
  return (
    <span className="mx-6 mb-6 inline-block w-52 ">
      <Link href={`/libraries/${seriesId}/series/${id}`} aria-label={title} tabIndex={-1}>
        {coverID ? (
          <img
            loading="lazy"
            className="h-52 w-52 cursor-pointer rounded-md border-2 border-transparent transition-colors hover:border-primary"
            src={`/api/stream/image/${coverID}`}
            alt="Series"
          />
        ) : (
          <MdImageNotSupported className="h-52 w-52 cursor-pointer rounded-md border-2 border-transparent transition-colors hover:border-primary" />
        )}
      </Link>

      <div className="relative p-2 text-center">
        <Link href={`/libraries/${seriesId}/series/${id}`}>
          <span className="line-clamp-2 cursor-pointer hover:underline  no-touch:group-focus:underline">{title}</span>
        </Link>
        {/*TODO amount*/}
        {/*<span className="text-font-secondary">{amount} Audiobooks</span>*/}
      </div>
    </span>
  )
}
