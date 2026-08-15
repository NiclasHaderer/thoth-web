import { PlayIcon } from "lucide-react"
import { FC } from "react"
import { rowInteraction } from "@thoth/lib/interactive"
import { cn } from "@thoth/lib/utils"
import { toReadableTime } from "./helpers"

export type TrackState = "playing" | "paused" | "idle"

interface TrackProps {
  title: string
  duration: number
  index: number
  trackNr?: number | null
  state: TrackState
  startPlayback: (index: number) => void
}

const Equalizer: FC<{ animated: boolean }> = ({ animated }) => (
  <span className="flex h-3.5 items-end gap-0.5">
    {[0, 1, 2].map(bar => (
      <span
        key={bar}
        style={{ animationDelay: `${bar * 0.15}s`, animationPlayState: animated ? "running" : "paused" }}
        className="bg-primary h-full w-0.5 origin-bottom [animation:equalizer_0.9s_ease-in-out_infinite] rounded-full"
      />
    ))}
  </span>
)

export const Track: FC<TrackProps> = ({ title, duration, trackNr, index, state, startPlayback }) => {
  const active = state === "playing" || state === "paused"

  return (
    <li>
      <button
        type="button"
        aria-label={`Play ${title}`}
        aria-current={active ? "true" : undefined}
        onClick={() => startPlayback(index)}
        className={cn(
          rowInteraction,
          "group flex w-full items-center gap-4 px-3 py-3 text-left",
          active && "bg-muted/60"
        )}
      >
        <span className="relative flex size-8 shrink-0 items-center justify-center">
          {active ? (
            <Equalizer animated={state === "playing"} />
          ) : (
            <span className="text-muted-foreground no-touch:group-hover:opacity-0 text-sm tabular-nums transition-opacity">
              {trackNr ?? index + 1}
            </span>
          )}
          {active ? null : (
            <span className="bg-primary text-primary-foreground no-touch:group-hover:scale-100 no-touch:group-hover:opacity-100 absolute inset-0 flex scale-90 items-center justify-center rounded-full opacity-0 transition-all">
              <PlayIcon aria-hidden className="size-3.5 fill-current" />
            </span>
          )}
        </span>

        <span className={cn("min-w-0 grow truncate text-sm", active && "text-primary font-medium")}>{title}</span>

        <span className="text-muted-foreground shrink-0 text-xs tabular-nums">{toReadableTime(duration)}</span>
        {active ? null : <PlayIcon aria-hidden className="touch:block hidden size-4 shrink-0 fill-current" />}
      </button>
    </li>
  )
}
