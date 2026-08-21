import { PauseIcon, PlayIcon } from "lucide-react"
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
    <li className="border-border/60 border-b">
      <button
        type="button"
        aria-label={`Play ${title}`}
        aria-current={active ? "true" : undefined}
        onClick={() => startPlayback(index)}
        className={cn(
          rowInteraction,
          "group flex w-full items-center gap-4 rounded-none px-2 py-3.5 text-left",
          active && "bg-muted/40"
        )}
      >
        <span className="flex w-7 shrink-0 items-center justify-center">
          {active ? (
            <Equalizer animated={state === "playing"} />
          ) : (
            <span className="text-muted-foreground/70 text-xs tabular-nums">{trackNr ?? index + 1}</span>
          )}
        </span>

        <span className={cn("min-w-0 grow truncate text-sm sm:text-base", active && "text-primary font-medium")}>
          {title}
        </span>

        <span className="text-muted-foreground shrink-0 text-xs tabular-nums">{toReadableTime(duration)}</span>

        <span
          aria-hidden
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-full border transition-colors",
            active
              ? "border-primary text-primary"
              : "border-muted-foreground/40 text-muted-foreground/70 no-touch:group-hover:border-foreground no-touch:group-hover:text-foreground"
          )}
        >
          {state === "playing" ? (
            <PauseIcon className="size-3 fill-current" />
          ) : (
            <PlayIcon className="size-3 fill-current" />
          )}
        </span>
      </button>
    </li>
  )
}
