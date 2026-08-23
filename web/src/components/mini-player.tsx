import { ImageOffIcon } from "lucide-react"
import { AnimatePresence, animate, motion, useMotionValue } from "motion/react"
import { FC, PropsWithChildren, useRef } from "react"
import { FullscreenPlayer } from "@thoth/components/fullscreen-player"
import { Link } from "@thoth/components/link.tsx"
import { PlayerButton } from "@thoth/components/player-button"
import {
  PlayPauseIcon,
  RotateCcwIcon,
  RotateCwIcon,
  SkipBackIcon,
  SkipForwardIcon,
  SquareIcon,
} from "@thoth/components/player-icons"
import { ProgressBar } from "@thoth/components/progress-bar"
import { FullscreenPlayerController } from "@thoth/hooks/fullscreen-player"
import { useBreakpoint } from "@thoth/hooks/use-media-query"
import { cn } from "@thoth/lib/utils"
import {
  SKIP_BACK,
  SKIP_FORWARD,
  useAutoAdvance,
  useAudioSource,
  useDuration,
  useProgress,
  usePlayState,
  usePlaybackPosition,
  usePreviousTrack,
  useSkip,
  useSleepTimerPause,
} from "../hooks/playback"
import { PlaybackTrack, usePlaybackState } from "../state/playback.state"
import { toReadableTime } from "./track/helpers"

const dockSpring = { type: "spring", stiffness: 520, damping: 32, mass: 0.7 } as const
const dockCollapse = { type: "spring", stiffness: 520, damping: 46, mass: 0.7 } as const
const DISMISS_DISTANCE = 96
const DISMISS_VELOCITY = 800
const DRAG_THRESHOLD = 16

const SwipeDock: FC<
  PropsWithChildren<{ enabled: boolean; onDismiss: () => void; player: FullscreenPlayerController; className: string }>
> = ({ enabled, onDismiss, player, className, children }) => {
  const y = useMotionValue(0)
  const dragSink = useMotionValue(0)
  const dragged = useRef(false)

  return (
    <motion.div
      style={{ y }}
      _dragY={dragSink}
      drag={enabled ? "y" : false}
      dragDirectionLock
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0}
      dragMomentum={false}
      onPointerDown={() => {
        dragged.current = false
      }}
      onDragStart={() => {
        dragged.current = true
      }}
      onClick={event => {
        if (!enabled || dragged.current) return
        if ((event.target as HTMLElement).closest("[data-dock-control]")) return
        player.open()
      }}
      onDrag={(_event, info) => {
        if (info.offset.y > 0) y.set(Math.max(0, info.offset.y - DRAG_THRESHOLD))
        else player.drag(info.offset.y + DRAG_THRESHOLD)
      }}
      onDragEnd={(_event, info) => {
        if (info.offset.y > DISMISS_DISTANCE || info.velocity.y > DISMISS_VELOCITY) return onDismiss()
        if (info.offset.y < 0) return player.release(info.offset.y + DRAG_THRESHOLD, info.velocity.y)
        animate(y, 0, dockSpring)
      }}
      className={cn(className, enabled && "touch-none!")}
    >
      {children}
    </motion.div>
  )
}

const Cover: FC<{ track: PlaybackTrack }> = ({ track }) =>
  track.coverID ? (
    <img
      className="size-12 rounded-md object-cover md:size-16"
      alt={track.title}
      loading="lazy"
      src={`/api/stream/images/${track.coverID}`}
    />
  ) : (
    <ImageOffIcon className="text-muted-foreground size-12 rounded-md md:size-16" />
  )

const TrackLabel: FC<{ track: PlaybackTrack }> = ({ track }) => (
  <div className="min-w-0 grow">
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
)

export const MiniPlayer: FC<{ player: FullscreenPlayerController }> = ({ player }) => {
  const playback = usePlaybackState()
  const track = playback.current

  useAudioSource(track?.id ? `/api/stream/audio/${track.id}` : undefined)
  const [position] = usePlaybackPosition()
  const duration = useDuration()
  const { progress, scrub, scrubEnd } = useProgress()
  const [playing, setPlaying] = usePlayState()
  const [previousTrack, canGoPrevious] = usePreviousTrack()
  const skip = useSkip()
  useSleepTimerPause()
  useAutoAdvance(playback.next)
  const isDesktop = useBreakpoint("md")

  return (
    <>
      <FullscreenPlayer player={player} enabled={!isDesktop} />
      <AnimatePresence initial={false}>
        {track ? (
          <motion.div
            key="playback"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0, transition: dockCollapse }}
            transition={dockSpring}
            className="overflow-clip [overflow-clip-margin:12px]"
          >
            <div className="px-2 pb-2 md:px-3 md:pb-3">
              <SwipeDock
                enabled={!isDesktop}
                onDismiss={playback.stop}
                player={player}
                className="bg-card/60 md:bg-card relative flex h-20 items-center gap-3 rounded-xl px-3 backdrop-blur-xl md:h-24 md:backdrop-blur-none"
              >
                <div data-dock-control className="absolute -top-[3px] right-0 left-0 z-10 max-md:pointer-events-none">
                  <ProgressBar
                    className="w-full"
                    trackClassName="h-3.5 rounded-t-xl [--bar-h:0.25rem] md:[--bar-h:0.375rem]"
                    progress={progress}
                    onScrub={scrub}
                    onScrubEnd={scrubEnd}
                  />
                </div>

                {isDesktop ? (
                  <Link
                    href={`/libraries/${track.libraryId}/books/${track.book.id}`}
                    className="flex min-w-0 grow items-center gap-3 outline-none"
                    aria-label={track.title}
                  >
                    <Cover track={track} />
                    <TrackLabel track={track} />
                  </Link>
                ) : (
                  <button
                    type="button"
                    aria-label="Open player"
                    className="flex min-w-0 grow items-center gap-3 text-left outline-none"
                  >
                    <Cover track={track} />
                    <TrackLabel track={track} />
                  </button>
                )}

                <div className="text-muted-foreground hidden shrink-0 items-center text-sm tabular-nums md:flex">
                  {toReadableTime(position)} / {toReadableTime(duration)}
                </div>

                <div data-dock-control className="flex shrink-0 items-center">
                  <PlayerButton
                    label="Previous track"
                    onPress={previousTrack}
                    isDisabled={!canGoPrevious}
                    className="hidden size-10 rounded-full md:flex"
                  >
                    <SkipBackIcon className="size-5" />
                  </PlayerButton>
                  <PlayerButton
                    label={`Skip back ${SKIP_BACK} seconds`}
                    onPress={() => skip(-SKIP_BACK)}
                    className="size-10 rounded-full"
                  >
                    <RotateCcwIcon className="size-5 max-md:[&_text]:hidden" seconds={SKIP_BACK} />
                  </PlayerButton>
                  <PlayerButton
                    label={playing ? "Pause" : "Play"}
                    onPress={() => setPlaying(!playing)}
                    className="size-11 rounded-full"
                  >
                    <PlayPauseIcon playing={playing} className="size-6" />
                  </PlayerButton>
                  <PlayerButton
                    label={`Skip forward ${SKIP_FORWARD} seconds`}
                    onPress={() => skip(SKIP_FORWARD)}
                    className="size-10 rounded-full"
                  >
                    <RotateCwIcon className="size-5 max-md:[&_text]:hidden" seconds={SKIP_FORWARD} />
                  </PlayerButton>
                  <PlayerButton
                    label="Next track"
                    onPress={playback.next}
                    isDisabled={playback.queue.length === 0}
                    className="hidden size-10 rounded-full md:flex"
                  >
                    <SkipForwardIcon className="size-5" />
                  </PlayerButton>
                  <PlayerButton label="Stop" onPress={playback.stop} className="hidden size-10 rounded-full md:flex">
                    <SquareIcon className="size-5" />
                  </PlayerButton>
                </div>
              </SwipeDock>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
