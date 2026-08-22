import { MotionValue, animate, useMotionValue, useTransform } from "motion/react"
import { useState } from "react"
import { useEvent } from "@thoth/hooks/events"

export const playerSpring = { type: "spring", stiffness: 420, damping: 38, mass: 0.8 } as const

const OPEN_FRACTION = 0.18
const OPEN_VELOCITY = 500

export interface FullscreenPlayerController {
  y: MotionValue<number>
  progress: MotionValue<number>
  viewportHeight: number
  visible: boolean
  expanded: boolean
  open: () => void
  close: () => void
  drag: (offsetY: number) => void
  release: (offsetY: number, velocityY: number) => void
}

export const useFullscreenPlayer = (): FullscreenPlayerController => {
  const [viewportHeight, setViewportHeight] = useState(() => window.innerHeight)
  const y = useMotionValue(viewportHeight)
  const progress = useTransform(y, [viewportHeight, 0], [0, 1])
  const [visible, setVisible] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEvent(window, "resize", () => {
    setViewportHeight(window.innerHeight)
    if (!expanded) y.set(window.innerHeight)
  })

  const open = () => {
    setVisible(true)
    setExpanded(true)
    animate(y, 0, playerSpring)
  }

  const dismiss = () => {
    setExpanded(false)
    animate(y, viewportHeight, { ...playerSpring, onComplete: () => setVisible(false) })
  }

  return {
    y,
    progress,
    viewportHeight,
    visible,
    expanded,
    open,
    close: dismiss,
    drag: offsetY => {
      if (!visible) setVisible(true)
      y.stop()
      y.set(Math.min(viewportHeight, Math.max(0, viewportHeight + offsetY)))
    },
    release: (offsetY, velocityY) => {
      if (offsetY < -viewportHeight * OPEN_FRACTION || velocityY < -OPEN_VELOCITY) return open()
      dismiss()
    },
  }
}
