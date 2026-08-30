import { PauseIcon, PlayIcon } from "lucide-react"
import { FC } from "react"
import { rowInteraction } from "@thoth/lib/interactive"
import { cn } from "@thoth/lib/utils"
import { toReadableTime } from "./helpers"

export type TrackState = "playing" | "paused" | "idle"

interface TrackProps {
  title: string
  durationMs: number
  index: number
  trackNr?: number | null
  state: TrackState
  startPlayback: (index: number) => void
  togglePlayback: (shouldPlay: boolean) => void
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

export const Track: FC<TrackProps> = ({ title, durationMs, trackNr, index, state, startPlayback, togglePlayback }) => {
  const active = state === "playing" || state === "paused"

  return (
    <li className="border-border/60 relative border-b">
      {active ? <span aria-hidden className="bg-primary absolute inset-y-0 left-0 w-0.5 rounded-full" /> : null}
      <button
        type="button"
        aria-label={state === "playing" ? `Pause ${title}` : `Play ${title}`}
        aria-current={active ? "true" : undefined}
        onClick={() => (active ? togglePlayback(state !== "playing") : startPlayback(index))}
        className={cn(
          rowInteraction,
          "group flex w-full items-center gap-4 rounded-none px-2 py-3.5 text-left [&_svg]:stroke-[1.5]",
          active && "bg-primary/10"
        )}
      >
        <span className="flex w-7 shrink-0 items-center justify-center">
          {active ? (
            <Equalizer animated={state === "playing"} />
          ) : (
            <span className="text-muted-foreground/70 text-xs tabular-nums">{trackNr ?? index + 1}</span>
          )}
        </span>

        <span className={cn("min-w-0 grow truncate text-sm sm:text-base", active && "font-medium")}>{title}</span>

        <span className="text-muted-foreground shrink-0 text-xs tabular-nums">{toReadableTime(durationMs / 1000)}</span>

        <span
          aria-hidden
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-full border transition-colors",
            active
              ? "border-primary bg-primary text-primary-foreground"
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
