import React from "react"
import { MdImageNotSupported, MdPlayCircle } from "react-icons/md"
import { NamedId } from "../../API/Audiobook"
import { environment } from "../../env"
import { ALink } from "../Common/ActiveLink"
import { toReadableTime } from "./helpers"

interface TrackProps {
  cover: string | null
  title: string
  author: NamedId
  duration: number
  index: number
  trackNr: number | null
  startPlayback: (index: number) => void
}

export const Track: React.VFC<TrackProps> = ({ cover, title, duration, trackNr, index, author, startPlayback }) => (
  <div className="flex even:bg-light-active p-2 mr-3 rounded-md">
    <div
      className="relative group cursor-pointer"
      onClick={() => startPlayback(index)}
      onKeyUp={e => e.key === "Enter" && startPlayback(index)}
    >
      {cover ? (
        <img
          className="w-16 h-16 object-contain rounded-md"
          src={`${environment.apiURL}/image/${cover}`}
          alt={title}
          loading="lazy"
        />
      ) : (
        <MdImageNotSupported className="w-16 h-16 rounded-md" />
      )}
      <button className="rounded-md h-full w-full absolute flex items-center justify-center left-0 top-0 duration-300 transition-all opacity-0 group-hover:bg-background group-hover:bg-opacity-40 bg-opacity-0 group-hover:opacity-100 focus:opacity-100">
        <MdPlayCircle className="w-6 h-6" />
      </button>
    </div>
    <div className="pl-6 flex flex-grow items-center justify-between">
      <div className="flex items-center">
        {trackNr}
        <div className="pl-6 flex flex-col">
          <span>{title}</span>
          <ALink href={`/authors/${author.id}`} tabIndex={-1}>
            <span className="cursor-pointer group-focus:underline hover:underline">{author.name}</span>
          </ALink>
        </div>
      </div>
      {toReadableTime(duration)}
    </div>
  </div>
)
