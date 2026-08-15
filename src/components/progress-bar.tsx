import { MotionValue, motion, useTransform } from "motion/react"
import { FC, PointerEventHandler, useLayoutEffect, useRef, useState } from "react"
import { cn } from "@thoth/lib/utils"

export const ProgressBar: FC<{
  className?: string
  progress: MotionValue<number>
  onScrub?: (percentage: number) => void
  onScrubEnd?: (percentage: number) => void
}> = ({ progress, onScrub, onScrubEnd, className }) => {
  const track = useRef<HTMLDivElement>(null)
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

  const percentageAt = (clientX: number) => {
    const rect = track.current?.getBoundingClientRect()
    if (!rect?.width) return 0
    return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
  }

  const down: PointerEventHandler<HTMLDivElement> = e => {
    e.currentTarget.setPointerCapture(e.pointerId)
    setScrubbing(true)
    onScrub?.(percentageAt(e.clientX))
  }

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
      className={cn("group cursor-pointer touch-none pb-2", className)}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
    >
      <div ref={track} className="bg-secondary/60 relative h-1.5 overflow-hidden">
        <motion.div className="bg-primary absolute inset-0 origin-left" style={{ scaleX: progress }} />
      </div>
      <motion.div
        className={cn(
          "bg-primary pointer-events-none absolute top-0 size-3 -translate-x-1/2 -translate-y-1/4 rounded-full opacity-0 transition-opacity",
          "group-hover:opacity-100",
          scrubbing && "opacity-100"
        )}
        style={{ x: thumbX }}
      />
    </div>
  )
}
