import React, { useEffect, useRef } from "react"
import { MdImageNotSupported, MdPauseCircle, MdPlayCircle, MdSkipNext, MdSkipPrevious, MdStop } from "react-icons/md"

import { environment } from "../env"
import { useAudio, useDuration, useOnEnded, usePercentage, usePlayState, usePosition } from "../Hooks/Playback"
import { usePlaybackState } from "../State/Playback"
import { ALink } from "./Common/ActiveLink"
import { ProgressBar } from "./Common/ProgressBar"
import { Ripple } from "./Common/Ripple"
import { toReadableTime } from "./Track/helpers"

export const Playback: React.VFC<{ className?: string }> = ({ className }) => {
  const playback = usePlaybackState()
  const track = playback.current

  const [audio] = useAudio(track?.id ? `${environment.apiURL}/audio/${track!.id}` : undefined)
  const [position] = usePosition(audio)
  const duration = useDuration(audio)
  const initialFocus = useRef<HTMLButtonElement | null>(null)
  const [percentage, setPercentage] = usePercentage(audio)
  const [playing, setPlaying] = usePlayState(audio)
  useOnEnded(audio, playback.next)

  useEffect(() => {
    initialFocus.current && initialFocus.current.focus()
  }, [initialFocus])

  if (!track) return <></>

  return (
    <div className={`relative flex justify-between bg-elevate p-2 md:p-3 ${className}`}>
      <ProgressBar
        className="absolute top-0 left-0 right-0 w-full -translate-y-1/2"
        percentage={percentage}
        onChange={setPercentage}
      />

      <div className="flex items-center">
        <ALink href={`/books/${track.book.id}`} className="mr-3" aria-label={track.title} tabIndex={-1}>
          {track.cover ? (
            <img
              className="h-12 w-12 rounded-md md:h-20 md:w-20"
              alt={track.title}
              loading="lazy"
              src={`${environment.apiURL}/image/${track.cover}`}
            />
          ) : (
            <MdImageNotSupported className="h-10 w-10 rounded-md md:h-20 md:w-20" />
          )}
        </ALink>

        <div className="flex flex-col justify-around">
          <div className="line-clamp-1">
            {track.trackNr ? track.trackNr + ". " : null} {track.title}
          </div>
          <div className="line-clamp-1">
            <ALink className="pr-2 hover:underline no-touch:focus:underline" href={`/authors/${track.author.id}`}>
              {track.author.name}
            </ALink>
            -
            <ALink className="pl-2 hover:underline no-touch:focus:underline" href={`/books/${track.book.id}`}>
              {track.book.title}
            </ALink>
          </div>
        </div>
      </div>

      <div className="hidden items-center md:flex">
        <span className="pr-2">{toReadableTime(position)}</span>:
        <span className="pl-2">{toReadableTime(duration)}</span>
      </div>

      <audio />
      <div className="flex items-center">
        <Ripple>
          <button
            onClick={playback.previous}
            disabled={playback.history.length === 0}
            className={`h-10 w-10 rounded-full p-1 no-touch:focus:bg-active-light ${
              playback.history.length === 0 ? "text-elevate" : ""
            }`}
          >
            <MdSkipPrevious className="h-full w-full" />
          </button>
        </Ripple>
        <Ripple>
          <button
            className="h-10 w-10 rounded-full p-1 no-touch:focus:bg-active-light"
            onClick={() => setPlaying(!playing)}
            ref={initialFocus}
          >
            {playing ? <MdPauseCircle className="h-full w-full" /> : <MdPlayCircle className="h-full w-full" />}
          </button>
        </Ripple>
        <Ripple>
          <button
            onClick={playback.next}
            disabled={playback.queue.length === 0}
            className={`h-10 w-10 rounded-full p-1 no-touch:focus:bg-active-light ${
              playback.queue.length === 0 ? "text-elevate" : ""
            }`}
          >
            <MdSkipNext className="h-full w-full" />
          </button>
        </Ripple>
        <Ripple>
          <button onClick={playback.stop} className="h-10 w-10 rounded-full p-1 no-touch:focus:bg-active-light">
            <MdStop className="h-full w-full" />
          </button>
        </Ripple>
      </div>
    </div>
  )
}
