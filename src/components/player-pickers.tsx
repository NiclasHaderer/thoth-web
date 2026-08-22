import { CheckIcon, GaugeIcon, MoonIcon } from "lucide-react"
import { FC, ReactNode, useEffect, useState } from "react"
import { BottomSheet } from "@thoth/components/bottom-sheet"
import { SheetTrigger } from "@thoth/components/ui/sheet"
import { usePlaybackRate } from "@thoth/hooks/playback"
import { rowInteraction } from "@thoth/lib/interactive"
import { cn } from "@thoth/lib/utils"
import { useSleepTimer } from "@thoth/state/sleep-timer.state"
import { toReadableTime } from "./track/helpers"
import { Button } from "./ui/button"

interface PickerOption {
  label: string
  active?: boolean
  separated?: boolean
  onSelect: () => void
}

const PickerRow: FC<{ option: PickerOption; onDone: () => void }> = ({ option, onDone }) => (
  <button
    type="button"
    onClick={() => {
      option.onSelect()
      onDone()
    }}
    aria-current={option.active ? "true" : undefined}
    className={cn(rowInteraction, "mx-2 flex h-12 items-center gap-3 rounded-lg px-3 text-left")}
  >
    <span className={cn("min-w-0 grow truncate text-sm", option.active ? "font-semibold" : "font-medium")}>
      {option.label}
    </span>
    {option.active ? <CheckIcon aria-hidden className="text-primary size-5 shrink-0" /> : null}
  </button>
)

const PickerSheet: FC<{
  title: string
  label: string
  ariaLabel: string
  icon: ReactNode
  active?: boolean
  options: PickerOption[]
}> = ({ title, label, ariaLabel, icon, active, options }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <SheetTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
      <Button
        variant="ghost"
        aria-label={ariaLabel}
        className={cn("h-9 gap-1.5 rounded-full px-3 tabular-nums [&_svg]:stroke-[1.5]", active && "text-primary")}
      >
        {icon}
        {label}
      </Button>
      <BottomSheet title={title} onDismiss={() => setIsOpen(false)}>
        <div className="flex flex-col gap-1 pb-3">
          {options.map(option => (
            <div key={option.label} className="flex flex-col">
              {option.separated ? <div className="bg-border mx-4 my-2 h-px" /> : null}
              <PickerRow option={option} onDone={() => setIsOpen(false)} />
            </div>
          ))}
        </div>
      </BottomSheet>
    </SheetTrigger>
  )
}

const SLEEP_OPTIONS = [5, 10, 15, 30, 45, 60]

export const SleepTimerPicker: FC = () => {
  const { minutes, endsAt, untilEndOfTrack, startCountdown, stopAfterTrack, clear } = useSleepTimer()
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!endsAt) return
    const tick = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(tick)
  }, [endsAt])

  const active = Boolean(endsAt) || untilEndOfTrack
  const remaining = endsAt ? Math.max(0, Math.round((endsAt - now) / 1000)) : 0
  const label = endsAt ? toReadableTime(remaining) : untilEndOfTrack ? "Track" : "Off"

  const options: PickerOption[] = [
    ...SLEEP_OPTIONS.map(option => ({
      label: `${option} minutes`,
      active: minutes === option,
      onSelect: () => startCountdown(option),
    })),
    { label: "End of track", active: untilEndOfTrack, onSelect: stopAfterTrack },
    ...(active ? [{ label: "Off", separated: true, onSelect: clear }] : []),
  ]

  return (
    <PickerSheet
      title="Sleep timer"
      label={label}
      ariaLabel={active ? `Sleep timer, ${label}` : "Sleep timer off"}
      icon={<MoonIcon className="size-4" />}
      active={active}
      options={options}
    />
  )
}

const RATES = [0.75, 1, 1.25, 1.5, 1.75, 2]

export const PlaybackRatePicker: FC = () => {
  const [rate, setRate] = usePlaybackRate()

  return (
    <PickerSheet
      title="Playback speed"
      label={`${rate}x`}
      ariaLabel={`Playback speed ${rate}x`}
      icon={<GaugeIcon className="size-4" />}
      active={rate !== 1}
      options={RATES.map(option => ({
        label: `${option}x`,
        active: rate === option,
        onSelect: () => setRate(option),
      }))}
    />
  )
}
