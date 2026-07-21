import { FC } from "react"
import { CiImageOff } from "react-icons/ci"
import { MdPlayCircle } from "react-icons/md"
import { Link } from "wouter"
import { NamedId, UUID } from "@thoth/client"
import { toReadableTime } from "./helpers"

interface TrackProps {
  coverID?: string | null
  title: string
  authors: NamedId[]
  duration: number
  index: number
  trackNr?: number | null
  startPlayback: (index: number) => void
  libraryId: UUID
}

export const Track: FC<TrackProps> = ({
  coverID,
  libraryId,
  title,
  duration,
  trackNr,
  index,
  authors,
  startPlayback,
}) => (
  <div className="even:bg-active-light mr-3 flex rounded-md p-2">
    <div
      className="group relative cursor-pointer"
      onClick={() => startPlayback(index)}
      onKeyUp={e => e.key === "Enter" && startPlayback(index)}
    >
      {coverID ? (
        <img
          className="h-16 w-16 rounded-md object-contain"
          src={`/api/stream/images/${coverID}`}
          alt={title}
          loading="lazy"
        />
      ) : (
        <CiImageOff className="h-16 w-16 rounded-md" />
      )}
      <button
        type="button"
        aria-label={`Play ${title}`}
        className="bg-opacity-0 group-hover:bg-surface group-hover:bg-opacity-40 absolute top-0 left-0 flex h-full w-full items-center justify-center rounded-md opacity-0 transition-all duration-300 group-hover:opacity-100 focus:opacity-100"
      >
        <MdPlayCircle className="h-6 w-6" aria-hidden />
      </button>
    </div>
    <div className="flex grow items-center justify-between pl-6">
      <div className="flex items-center">
        {trackNr}
        <div className="flex flex-col pl-6">
          <span>{title}</span>
          {authors.map(author => (
            <Link href={`/libraries/${libraryId}/authors/${author.id}`} tabIndex={-1} key={author.id}>
              <span className="cursor-pointer group-focus:underline hover:underline">{author.name}</span>
            </Link>
          ))}
        </div>
      </div>
      {toReadableTime(duration)}
    </div>
  </div>
)
