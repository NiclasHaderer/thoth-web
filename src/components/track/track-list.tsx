import { FC, ReactNode, memo } from "react"
import { UUID } from "@thoth/client"
import { detailLabel } from "@thoth/components/detail/detail-layout"
import { Track } from "./track"

export interface TrackListEntry {
  id: UUID
  title: string
  durationMs: number
  trackNr?: number | null
}

export const TrackList: FC<{
  tracks: TrackListEntry[]
  label?: string
  trailing?: ReactNode
  activeId?: UUID
  playing: boolean
  className?: string
  onStart: (index: number) => void
  onToggle: (shouldPlay: boolean) => void
}> = memo(({ tracks, label, trailing, activeId, playing, className, onStart, onToggle }) => (
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
          state={track.id === activeId ? (playing ? "playing" : "paused") : "idle"}
          startPlayback={onStart}
          togglePlayback={onToggle}
        />
      ))}
    </ul>
  </section>
))
