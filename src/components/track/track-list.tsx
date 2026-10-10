import { FC, ReactNode, memo } from "react"
import { UUID } from "@thoth/client"
import { detailLabel } from "@thoth/components/detail/detail-layout"
import { Skeleton } from "@thoth/components/ui/skeleton"
import { Track } from "./track"

const TITLE_WIDTHS = ["w-3/5", "w-4/5", "w-2/3", "w-1/2", "w-3/4"]

export const TrackListSkeleton: FC<{ count?: number }> = ({ count = 5 }) => (
  <ul className="flex flex-col">
    {Array.from({ length: count }, (_, index) => (
      <li key={index} className="border-border/60 flex items-center gap-4 border-b px-2 py-3.5">
        <span className="flex w-7 shrink-0 justify-center">
          <Skeleton className="h-3 w-3" />
        </span>
        <span className="min-w-0 grow text-sm sm:text-base">
          <Skeleton className={`h-[1.25em] ${TITLE_WIDTHS[index % TITLE_WIDTHS.length]}`} />
        </span>
        <Skeleton className="h-3 w-10 shrink-0" />
        <Skeleton className="size-7 shrink-0 rounded-full" />
      </li>
    ))}
  </ul>
)

export interface TrackListEntry {
  id: UUID
  title: string
  durationMs: number
  trackNr: number
}

export const TrackList: FC<{
  tracks: TrackListEntry[]
  label?: string
  trailing?: ReactNode
  activeId?: UUID
  playedCount?: number
  playing: boolean
  disabled?: boolean
  className?: string
  onStart: (index: number) => void
  onToggle: (shouldPlay: boolean) => void
}> = memo(({ tracks, label, trailing, activeId, playedCount = 0, playing, disabled, className, onStart, onToggle }) => (
  <section className={className}>
    {label ? (
      <h2 className={`${detailLabel} border-border/60 flex items-center justify-between border-y py-2.5`}>
        <span>{label}</span>
        {trailing ? <span>{trailing}</span> : null}
      </h2>
    ) : null}
    <ul className="flex flex-col">
      {tracks.map((track, index) => (
        <Track
          key={track.id}
          {...track}
          index={index}
          played={index < playedCount}
          disabled={disabled}
          state={track.id === activeId ? (playing ? "playing" : "paused") : "idle"}
          startPlayback={onStart}
          togglePlayback={onToggle}
        />
      ))}
    </ul>
  </section>
))
