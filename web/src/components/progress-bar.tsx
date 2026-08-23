import { MotionValue, motion, useTransform } from "motion/react"
import { FC, PointerEventHandler, useCallback, useLayoutEffect, useRef, useState } from "react"
import { useEvent } from "@thoth/hooks/events"
import { cn } from "@thoth/lib/utils"

export const ProgressBar: FC<{
  className?: string
  trackClassName?: string
  progress: MotionValue<number>
  vertical?: boolean
  thumb?: boolean
  onScrub?: (percentage: number) => void
  onScrubEnd?: (percentage: number) => void
}> = ({ progress, onScrub, onScrubEnd, className, trackClassName, vertical = false, thumb = true }) => {
  const track = useRef<HTMLDivElement>(null)
  const container = useRef<HTMLDivElement>(null)
  const [trackSize, setTrackSize] = useState(0)
  const [scrubbing, setScrubbing] = useState(false)
  const thumbOffset = useTransform(progress, p => (vertical ? (1 - p) * trackSize : p * trackSize))

  useLayoutEffect(() => {
    const element = track.current
    if (!element) return
    const observer = new ResizeObserver(([entry]) =>
      setTrackSize(vertical ? entry.contentRect.height : entry.contentRect.width)
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [vertical])

  const percentageAt = useCallback(
    (clientX: number, clientY: number) => {
      const rect = track.current?.getBoundingClientRect()
      if (!rect?.width || !rect.height) return 0
      const fraction = vertical ? 1 - (clientY - rect.top) / rect.height : (clientX - rect.left) / rect.width
      return Math.min(1, Math.max(0, fraction))
    },
    [vertical]
  )

  useEvent(container, "pointerdown", event => {
    event.stopPropagation()
    container.current?.setPointerCapture(event.pointerId)
    setScrubbing(true)
    onScrub?.(percentageAt(event.clientX, event.clientY))
  })

  const move: PointerEventHandler<HTMLDivElement> = e => {
    if (!scrubbing) return
    onScrub?.(percentageAt(e.clientX, e.clientY))
  }

  const up: PointerEventHandler<HTMLDivElement> = e => {
    if (!scrubbing) return
    setScrubbing(false)
    onScrubEnd?.(percentageAt(e.clientX, e.clientY))
  }

  return (
    <div
      ref={container}
      className={cn(
        "group relative cursor-pointer touch-none",
        vertical ? "pr-2 pl-[3px]" : "pt-[3px] pb-2",
        "touch:after:absolute touch:after:content-['']",
        vertical
          ? "touch:after:inset-y-0 touch:after:-right-2.5 touch:after:-left-2.5"
          : "touch:after:inset-x-0 touch:after:-top-2.5 touch:after:-bottom-2.5",
        className
      )}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
    >
      <div ref={track} className={cn("relative overflow-hidden", vertical ? "w-1.5" : "h-1.5", trackClassName)}>
        <div
          className={cn(
            "bg-secondary/60 absolute",
            vertical ? "inset-y-0 left-0 w-[var(--bar-h,0.375rem)]" : "inset-x-0 top-0 h-[var(--bar-h,0.375rem)]"
          )}
        />
        <motion.div
          className={cn(
            "bg-primary absolute",
            vertical
              ? "inset-y-0 left-0 w-[var(--bar-h,0.375rem)] origin-bottom"
              : "inset-x-0 top-0 h-[var(--bar-h,0.375rem)] origin-left"
          )}
          style={vertical ? { scaleY: progress } : { scaleX: progress }}
        />
      </div>
      {thumb ? (
        <motion.div
          className={cn(
            "bg-primary pointer-events-none absolute size-3 rounded-full",
            vertical ? "left-0 -translate-y-1/2" : "top-0 -translate-x-1/2",
            "opacity-0 transition-opacity group-hover:opacity-100",
            scrubbing && "opacity-100"
          )}
          style={vertical ? { y: thumbOffset } : { x: thumbOffset }}
          animate={{ scale: scrubbing ? 1.25 : 1 }}
          transition={{ duration: 0.15 }}
        />
      ) : null}
    </div>
  )
}
