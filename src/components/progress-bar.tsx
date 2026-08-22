import { MotionValue, motion, useTransform } from "motion/react"
import { FC, PointerEventHandler, useCallback, useLayoutEffect, useRef, useState } from "react"
import { useEvent } from "@thoth/hooks/events"
import { cn } from "@thoth/lib/utils"

export const ProgressBar: FC<{
  className?: string
  trackClassName?: string
  progress: MotionValue<number>
  onScrub?: (percentage: number) => void
  onScrubEnd?: (percentage: number) => void
}> = ({ progress, onScrub, onScrubEnd, className, trackClassName }) => {
  const track = useRef<HTMLDivElement>(null)
  const container = useRef<HTMLDivElement>(null)
  const [trackWidth, setTrackWidth] = useState(0)
  const [scrubbing, setScrubbing] = useState(false)
  const thumbX = useTransform(progress, p => p * trackWidth)

  useLayoutEffect(() => {
    const element = track.current
    if (!element) return
    const observer = new ResizeObserver(([entry]) => setTrackWidth(entry.contentRect.width))
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const percentageAt = useCallback((clientX: number) => {
    const rect = track.current?.getBoundingClientRect()
    if (!rect?.width) return 0
    return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
  }, [])

  useEvent(container, "pointerdown", event => {
    event.stopPropagation()
    container.current?.setPointerCapture(event.pointerId)
    setScrubbing(true)
    onScrub?.(percentageAt(event.clientX))
  })

  const move: PointerEventHandler<HTMLDivElement> = e => {
    if (!scrubbing) return
    onScrub?.(percentageAt(e.clientX))
  }

  const up: PointerEventHandler<HTMLDivElement> = e => {
    if (!scrubbing) return
    setScrubbing(false)
    onScrubEnd?.(percentageAt(e.clientX))
  }

  return (
    <div
      ref={container}
      className={cn(
        "group relative cursor-pointer touch-none pt-[3px] pb-2",
        "touch:after:absolute touch:after:inset-x-0 touch:after:-top-2.5 touch:after:-bottom-2.5 touch:after:content-['']",
        className
      )}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
    >
      <div ref={track} className={cn("bg-secondary/60 relative h-1.5 overflow-hidden", trackClassName)}>
        <motion.div className="bg-primary absolute inset-0 origin-left" style={{ scaleX: progress }} />
      </div>
      <motion.div
        className={cn(
          "bg-primary pointer-events-none absolute top-0 size-3 -translate-x-1/2 rounded-full",
          "opacity-0 transition-opacity group-hover:opacity-100",
          scrubbing && "opacity-100"
        )}
        style={{ x: thumbX }}
        animate={{ scale: scrubbing ? 1.25 : 1 }}
        transition={{ duration: 0.15 }}
      />
    </div>
  )
}
