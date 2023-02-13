import React from "react"
import { MdImageNotSupported, MdPlayCircle } from "react-icons/md"
import { NamedId } from "../../API/models/Api"
import { environment } from "../../env"
import { ALink } from "../Common/ActiveLink"
import { toReadableTime } from "./helpers"

interface TrackProps {
  coverID: string | null
  title: string
  authors: NamedId[]
  duration: number
  index: number
  trackNr: number | null
  startPlayback: (index: number) => void
}

export const Track: React.VFC<TrackProps> = ({ coverID, title, duration, trackNr, index, authors, startPlayback }) => (
  <div className="mr-3 flex rounded-md p-2 even:bg-active-light">
    <div
      className="group relative cursor-pointer"
      onClick={() => startPlayback(index)}
      onKeyUp={e => e.key === "Enter" && startPlayback(index)}
    >
      {coverID ? (
        <img
          className="h-16 w-16 rounded-md object-contain"
          src={`${environment.apiURL}/image/${coverID}`}
          alt={title}
          loading="lazy"
        />
      ) : (
        <MdImageNotSupported className="h-16 w-16 rounded-md" />
      )}
      <button className="absolute left-0 top-0 flex h-full w-full items-center justify-center rounded-md bg-opacity-0 opacity-0 transition-all duration-300 focus:opacity-100 group-hover:bg-surface group-hover:bg-opacity-40 group-hover:opacity-100">
        <MdPlayCircle className="h-6 w-6" />
      </button>
    </div>
    <div className="flex flex-grow items-center justify-between pl-6">
      <div className="flex items-center">
        {trackNr}
        <div className="flex flex-col pl-6">
          <span>{title}</span>
          {authors.map(author => (
            <ALink href={`/authors/${author.id}`} tabIndex={-1} key={author.id}>
              <span className="cursor-pointer hover:underline group-focus:underline">{author.name}</span>
            </ALink>
          ))}
        </div>
      </div>
      {toReadableTime(duration)}
    </div>
  </div>
)
