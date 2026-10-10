import { MotionValue, motion, useMotionValueEvent, useTransform } from "motion/react"
import { FC, useLayoutEffect, useRef, useState } from "react"
import { useEvent } from "@thoth/hooks/use-event"
import { cn } from "@thoth/lib/utils"

export const ProgressBar: FC<{
  label: string
  className?: string
  trackClassName?: string
  progress: MotionValue<number>
  onScrub?: (percentage: number) => void
  onScrubEnd?: (percentage: number) => void
}> = ({ label, progress, onScrub, onScrubEnd, className, trackClassName }) => {
  const track = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const [trackSize, setTrackSize] = useState(0)
  const [scrubbing, setScrubbing] = useState(false)
  const thumbOffset = useTransform(progress, p => p * trackSize)

  useLayoutEffect(() => {
    const element = track.current
    if (!element) return
    const observer = new ResizeObserver(([entry]) => setTrackSize(entry.contentRect.width))
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useMotionValueEvent(progress, "change", value => {
    if (input.current) input.current.value = String(value)
  })

  const end = () => {
    if (!input.current) return
    setScrubbing(false)
    onScrubEnd?.(input.current.valueAsNumber)
  }

  // Native change, not React's onChange: it fires once per committed value.
  useEvent(input, "change", end)

  return (
    <div className={cn("group relative pt-[3px] pb-2", className)}>
      {/* 1px thumb: a range input insets the pointer mapping by half its thumb width. */}
      <input
        ref={input}
        type="range"
        aria-label={label}
        min={0}
        max={1}
        step={0.001}
        defaultValue={progress.get()}
        onChange={event => {
          setScrubbing(true)
          onScrub?.(event.currentTarget.valueAsNumber)
        }}
        onPointerCancel={end}
        className={cn(
          "peer absolute inset-0 z-10 size-full cursor-pointer touch-none appearance-none opacity-0",
          "touch:-top-2.5 touch:h-[calc(100%+1.25rem)]",
          "[&::-moz-range-thumb]:w-px [&::-moz-range-thumb]:border-0",
          "[&::-webkit-slider-thumb]:w-px [&::-webkit-slider-thumb]:appearance-none"
        )}
      />
      <div ref={track} className={cn("relative h-1.5 overflow-hidden", trackClassName)}>
        <div className="bg-secondary/60 absolute inset-x-0 top-0 h-[var(--bar-h,0.375rem)]" />
        <motion.div
          className="bg-primary absolute inset-x-0 top-0 h-[var(--bar-h,0.375rem)] origin-left"
          style={{ scaleX: progress }}
        />
      </div>
      <motion.div
        className={cn(
          "bg-primary ring-ring/50 pointer-events-none absolute top-0 size-3 -translate-x-1/2 rounded-full",
          "opacity-0 transition-opacity group-hover:opacity-100",
          "peer-focus-visible:opacity-100 peer-focus-visible:ring-3",
          scrubbing && "opacity-100"
        )}
        style={{ x: thumbOffset }}
        animate={{ scale: scrubbing ? 1.25 : 1 }}
        transition={{ duration: 0.15 }}
      />
    </div>
  )
}
