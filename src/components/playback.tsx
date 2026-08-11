import { CirclePauseIcon, CirclePlayIcon, SkipForwardIcon, SkipBackIcon, SquareIcon, ImageOffIcon } from "lucide-react"
import { FC, useEffect, useRef } from "react"
import { Link } from "wouter"
import { ProgressBar } from "@thoth/components/progress-bar"
import { Ripple } from "@thoth/components/ripple"
import { Button } from "@thoth/components/ui/button"
import { useAudio, useDuration, useOnEnded, usePercentage, usePlayState, usePosition } from "../hooks/playback"
import { usePlaybackState } from "../state/playback.state"
import { toReadableTime } from "./track/helpers"

export const Playback: FC<{ className?: string }> = ({ className }) => {
  const playback = usePlaybackState()
  const track = playback.current

  const [audio] = useAudio(track?.id ? `/api/audio/${track.id}` : undefined)
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
    <div className={`bg-card relative flex justify-between p-2 md:p-3 ${className}`}>
      <ProgressBar
        className="absolute top-0 right-0 left-0 w-full -translate-y-1/2"
        percentage={percentage}
        onChange={setPercentage}
      />

      <div className="flex items-center">
        <Link
          href={`/libraries/${track.libraryId}/books/${track.book.id}`}
          className="mr-3"
          aria-label={track.title}
          tabIndex={-1}
        >
          {track.coverID ? (
            <img
              className="h-12 w-12 rounded-md md:h-20 md:w-20"
              alt={track.title}
              loading="lazy"
              src={`/api/stream/images/${track.coverID}`}
            />
          ) : (
            <ImageOffIcon className="h-10 w-10 rounded-md md:h-20 md:w-20" />
          )}
        </Link>

        <div className="flex flex-col justify-around">
          <div className="line-clamp-1">
            {track.trackNr ? track.trackNr + ". " : null} {track.title}
          </div>
          <div className="line-clamp-1">
            {track.authors.map((author, index) => (
              <Link
                className="no-touch:focus:underline pr-2 hover:underline"
                href={`/libraries/${track.libraryId}/authors/${author.id}`}
                key={index}
              >
                {author.name}
              </Link>
            ))}
            -
            <Link className="no-touch:focus:underline pl-2 hover:underline" href={`/books/${track.book.id}`}>
              {track.book.title}
            </Link>
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
          <Button
            variant="ghost"
            size="icon"
            aria-label="Previous track"
            onPress={playback.previous}
            isDisabled={playback.history.length === 0}
            className={`h-10 w-10 rounded-full ${playback.history.length === 0 ? "text-muted-foreground" : ""}`}
          >
            <SkipBackIcon className="size-full" />
          </Button>
        </Ripple>
        <Ripple>
          <Button
            ref={initialFocus}
            variant="ghost"
            size="icon"
            aria-label={playing ? "Pause" : "Play"}
            onPress={() => setPlaying(!playing)}
            className="h-10 w-10 rounded-full"
          >
            {playing ? <CirclePauseIcon className="size-full" /> : <CirclePlayIcon className="size-full" />}
          </Button>
        </Ripple>
        <Ripple>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Next track"
            onPress={playback.next}
            isDisabled={playback.queue.length === 0}
            className={`h-10 w-10 rounded-full ${playback.queue.length === 0 ? "text-muted-foreground" : ""}`}
          >
            <SkipForwardIcon className="size-full" />
          </Button>
        </Ripple>
        <Ripple>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Stop"
            onPress={playback.stop}
            className="h-10 w-10 rounded-full"
          >
            <SquareIcon className="size-full" />
          </Button>
        </Ripple>
      </div>
    </div>
  )
}
