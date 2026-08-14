import {
  ImageOffIcon,
  PauseIcon,
  PlayIcon,
  RotateCcwIcon,
  RotateCwIcon,
  SkipBackIcon,
  SkipForwardIcon,
  SquareIcon,
} from "lucide-react"
import { FC } from "react"
import { Link } from "wouter"
import { ProgressBar } from "@thoth/components/progress-bar"
import { Button } from "@thoth/components/ui/button"
import { useAudio, useDuration, useOnEnded, usePercentage, usePlayState, usePosition } from "../hooks/playback"
import { usePlaybackState } from "../state/playback.state"
import { toReadableTime } from "./track/helpers"

const SKIP_BACK = 15
const SKIP_FORWARD = 30

export const Playback: FC = () => {
  const playback = usePlaybackState()
  const track = playback.current

  const [audio] = useAudio(track?.id ? `/api/audio/${track.id}` : undefined)
  const [position, setPosition] = usePosition(audio)
  const duration = useDuration(audio)
  const [percentage, setPercentage] = usePercentage(audio)
  const [playing, setPlaying] = usePlayState(audio)
  useOnEnded(audio, playback.next)

  if (!track) return null

  return (
    <div className="border-border/60 md:bg-card relative flex h-16 items-center gap-3 border-b-[0.5px] px-3 md:mx-3 md:mb-3 md:h-24 md:rounded-xl md:border-0">
      <ProgressBar className="absolute top-0 right-0 left-0 w-full" percentage={percentage} onChange={setPercentage} />

      <Link
        href={`/libraries/${track.libraryId}/books/${track.book.id}`}
        className="flex min-w-0 grow items-center gap-3 outline-none"
        aria-label={track.title}
      >
        {track.coverID ? (
          <img
            className="size-10 shrink-0 rounded-md object-cover md:size-16"
            alt={track.title}
            loading="lazy"
            src={`/api/stream/images/${track.coverID}`}
          />
        ) : (
          <ImageOffIcon className="text-muted-foreground size-10 shrink-0 rounded-md md:size-16" />
        )}
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">
            {track.trackNr ? `${track.trackNr}. ` : null}
            {track.title}
          </div>
          <div className="text-muted-foreground truncate text-xs">
            {track.authors.map(author => author.name).join(", ")}
            {track.authors.length ? " - " : null}
            {track.book.title}
          </div>
        </div>
      </Link>

      <div className="text-muted-foreground hidden shrink-0 items-center text-sm tabular-nums md:flex">
        {toReadableTime(position)} / {toReadableTime(duration)}
      </div>

      <div className="flex shrink-0 items-center">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Previous track"
          onPress={playback.previous}
          isDisabled={playback.history.length === 0}
          className="hidden size-10 rounded-full md:flex"
        >
          <SkipBackIcon className="size-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Skip back ${SKIP_BACK} seconds`}
          onPress={() => setPosition(Math.max(0, (position ?? 0) - SKIP_BACK))}
          className="size-10 rounded-full"
        >
          <RotateCcwIcon className="size-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label={playing ? "Pause" : "Play"}
          onPress={() => setPlaying(!playing)}
          className="size-11 rounded-full"
        >
          {playing ? <PauseIcon className="size-6" /> : <PlayIcon className="size-6" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Skip forward ${SKIP_FORWARD} seconds`}
          onPress={() => setPosition((position ?? 0) + SKIP_FORWARD)}
          className="size-10 rounded-full"
        >
          <RotateCwIcon className="size-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Next track"
          onPress={playback.next}
          isDisabled={playback.queue.length === 0}
          className="hidden size-10 rounded-full md:flex"
        >
          <SkipForwardIcon className="size-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Stop"
          onPress={playback.stop}
          className="hidden size-10 rounded-full md:flex"
        >
          <SquareIcon className="size-5" />
        </Button>
      </div>
    </div>
  )
}
