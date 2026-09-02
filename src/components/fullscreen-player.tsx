import { ImageOffIcon } from "lucide-react"
import { animate, motion, useMotionValue } from "motion/react"
import { FC, Fragment, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { Link } from "@thoth/components/link.tsx"
import { PlayerButton } from "@thoth/components/player-button"
import {
  PlayPauseIcon,
  RotateCcwIcon,
  RotateCwIcon,
  SkipBackIcon,
  SkipForwardIcon,
} from "@thoth/components/player-icons"
import { PlaybackRatePicker, SleepTimerPicker } from "@thoth/components/player-pickers"
import { ProgressBar } from "@thoth/components/progress-bar"
import { Button } from "@thoth/components/ui/button"
import { useEvent } from "@thoth/hooks/events"
import { FullscreenPlayerController, playerSpring } from "@thoth/hooks/fullscreen-player"
import { cn } from "@thoth/lib/utils"
import {
  PlayingBook,
  SKIP_BACK,
  SKIP_FORWARD,
  audio,
  hasNextTrack,
  jumpToTrack,
  nextTrack,
  previousOrRestart,
  skip,
  useAudio,
  useCanGoPrevious,
  usePlayback,
  usePlaying,
  useTrackProgress,
} from "@thoth/playback"
import { toReadableTime } from "./track/helpers"
import { TrackList } from "./track/track-list"

const CLOSE_FRACTION = 0.22
const CLOSE_VELOCITY = 600
const PANE_DISTANCE = 60
const PANE_VELOCITY = 400

export const FullscreenPlayer: FC<{ player: FullscreenPlayerController; enabled: boolean }> = ({ player, enabled }) => {
  const { visible, close } = player
  const book = usePlayback(s => s.book)

  useEffect(() => {
    if (visible && (!book || !enabled)) close()
  }, [visible, book, enabled, close])

  if (!visible || !enabled || !book) return null

  return <FullscreenPlayerBody player={player} book={book} />
}

const FullscreenPlayerBody: FC<{ player: FullscreenPlayerController; book: PlayingBook }> = ({ player, book }) => {
  const { y, viewportHeight, close } = player
  const index = usePlayback(s => s.trackIndex)
  const track = book.tracks[index]
  const hasNext = usePlayback(hasNextTrack)
  const position = useAudio(media => media.currentTime)
  const duration = useAudio(media => media.duration)
  const { progress, scrub, scrubEnd } = useTrackProgress()
  const playing = usePlaying()
  const canGoPrevious = useCanGoPrevious()
  const [pane, setPane] = useState(0)
  const [queueAtTop, setQueueAtTop] = useState(true)
  const viewport = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)

  const paneWidth = () => viewport.current?.clientWidth ?? 0

  const goToPane = (next: number) => {
    setPane(next)
    animate(x, -next * paneWidth(), playerSpring)
  }

  useEvent(window, "resize", () => x.set(-pane * paneWidth()))

  const cover = book.coverID ? `/api/stream/images/${book.coverID}` : undefined

  return createPortal(
    <motion.div
      style={{ y, height: viewportHeight }}
      drag="y"
      dragDirectionLock
      dragConstraints={{ top: 0, bottom: viewportHeight }}
      dragElastic={0}
      dragMomentum={false}
      onDragEnd={(_event, info) => {
        if (Math.abs(info.offset.y) < Math.abs(info.offset.x)) return
        if (y.get() > viewportHeight * CLOSE_FRACTION || info.velocity.y > CLOSE_VELOCITY) return close()
        animate(y, 0, playerSpring)
      }}
      className="bg-card/75 fixed inset-x-0 top-0 z-30 flex touch-none flex-col overflow-hidden backdrop-blur-xl"
    >
      {cover ? (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <img src={cover} alt="" className="h-full w-full scale-125 object-cover opacity-40 blur-3xl" />
          <div className="from-background/40 to-background/75 absolute inset-0 bg-gradient-to-b" />
        </div>
      ) : null}

      <div className="relative flex min-h-0 grow flex-col pt-[calc(env(safe-area-inset-top)+0.75rem)] pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
        <div className="flex items-center justify-center gap-2 pt-3">
          {["Now playing", "Queue"].map((label, index) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              aria-current={pane === index ? "true" : undefined}
              onClick={() => goToPane(index)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                pane === index ? "bg-foreground w-5" : "bg-muted-foreground/40 w-1.5"
              )}
            />
          ))}
        </div>

        <div ref={viewport} className="flex min-h-0 grow overflow-hidden">
          <motion.div
            style={{ x }}
            className="flex w-[200%] shrink-0"
            drag="x"
            dragDirectionLock
            dragConstraints={viewport}
            dragElastic={0.12}
            dragMomentum={false}
            onDragEnd={(_event, info) => {
              if (Math.abs(info.offset.x) < Math.abs(info.offset.y)) return goToPane(pane)
              if (info.offset.x < -PANE_DISTANCE || info.velocity.x < -PANE_VELOCITY) return goToPane(1)
              if (info.offset.x > PANE_DISTANCE || info.velocity.x > PANE_VELOCITY) return goToPane(0)
              goToPane(pane)
            }}
          >
            <div className="flex w-1/2 min-w-0 flex-col px-6">
              <div className="flex min-h-0 grow items-center justify-center py-6">
                {cover ? (
                  <img
                    alt={book.title}
                    src={cover}
                    className="max-h-full w-full max-w-sm rounded-2xl object-contain shadow-2xl shadow-black/40"
                  />
                ) : (
                  <ImageOffIcon className="text-muted-foreground/60 size-32" />
                )}
              </div>

              <div className="flex min-w-0 flex-col gap-1">
                <Link
                  href={`/libraries/${book.libraryId}/books/${book.id}`}
                  className="block truncate text-xl font-bold tracking-tight outline-none"
                >
                  {track.trackNr ? `${track.trackNr}. ` : null}
                  {track.title}
                </Link>
                <div className="text-muted-foreground truncate text-sm">
                  {book.authors.map((author, position) => (
                    <Fragment key={author.id}>
                      {position > 0 ? ", " : null}
                      <Link
                        href={`/libraries/${book.libraryId}/authors/${author.id}`}
                        className="hover:underline focus-visible:underline focus-visible:outline-none"
                      >
                        {author.name}
                      </Link>
                    </Fragment>
                  ))}
                  {book.authors.length ? " - " : null}
                  <Link
                    href={`/libraries/${book.libraryId}/books/${book.id}`}
                    className="hover:underline focus-visible:underline focus-visible:outline-none"
                  >
                    {book.title}
                  </Link>
                </div>
              </div>

              <div className="pt-6">
                <ProgressBar
                  className="w-full"
                  trackClassName="rounded-full"
                  progress={progress}
                  onScrub={scrub}
                  onScrubEnd={scrubEnd}
                />
                <div className="text-muted-foreground flex items-center justify-between text-xs tabular-nums">
                  <span>{toReadableTime(position)}</span>
                  <span>{toReadableTime(duration)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <PlayerButton
                  label="Previous track"
                  onPress={previousOrRestart}
                  isDisabled={!canGoPrevious}
                  className="size-11 rounded-full"
                >
                  <SkipBackIcon className="size-6" />
                </PlayerButton>
                <PlayerButton
                  label={`Skip back ${SKIP_BACK} seconds`}
                  onPress={() => skip(-SKIP_BACK)}
                  className="size-12 rounded-full"
                >
                  <RotateCcwIcon className="size-7" seconds={SKIP_BACK} />
                </PlayerButton>
                <Button
                  aria-label={playing ? "Pause" : "Play"}
                  onPress={() => audio.setPlaying(!playing)}
                  className="size-16 rounded-full [&_svg]:stroke-[1.5]"
                >
                  <PlayPauseIcon playing={playing} className="size-8" />
                </Button>
                <PlayerButton
                  label={`Skip forward ${SKIP_FORWARD} seconds`}
                  onPress={() => skip(SKIP_FORWARD)}
                  className="size-12 rounded-full"
                >
                  <RotateCwIcon className="size-7" seconds={SKIP_FORWARD} />
                </PlayerButton>
                <PlayerButton
                  label="Next track"
                  onPress={nextTrack}
                  isDisabled={!hasNext}
                  className="size-11 rounded-full"
                >
                  <SkipForwardIcon className="size-6" />
                </PlayerButton>
              </div>

              <div className="flex items-center justify-between pt-4">
                <PlaybackRatePicker />
                <SleepTimerPicker />
              </div>
            </div>

            <div className="flex w-1/2 min-w-0 flex-col px-4 pt-4">
              <div
                onScroll={event => setQueueAtTop(event.currentTarget.scrollTop <= 0)}
                className={cn(
                  "min-h-0 grow overflow-y-auto overscroll-contain",
                  queueAtTop ? "touch-pan-down" : "touch-pan-y"
                )}
              >
                <TrackList
                  tracks={book.tracks}
                  activeId={track.id}
                  playing={playing}
                  onStart={jumpToTrack}
                  onToggle={audio.setPlaying}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>,
    document.body
  )
}
