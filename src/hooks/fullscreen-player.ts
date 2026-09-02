import { MotionValue, animate, useMotionValue, useTransform } from "motion/react"
import { useEffect, useRef, useState } from "react"
import { useLocation, useSearch } from "wouter"
import { useEvent } from "@thoth/hooks/events"
import { useBreakpoint } from "@thoth/hooks/use-media-query"
import { usePlayback } from "@thoth/playback"
import { withoutSearchParam } from "@thoth/utils/utils"

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
  const [path, navigate] = useLocation()
  const search = useSearch()
  const isDesktop = useBreakpoint("md")
  const hasTrack = usePlayback(s => !!s.book)

  const playerOpen = new URLSearchParams(search).has("player")
  const expanded = playerOpen && hasTrack && !isDesktop
  const [visible, setVisible] = useState(expanded)
  if (expanded && !visible) setVisible(true)

  const restored = useRef(playerOpen)
  const pushed = useRef(false)
  const wasExpanded = useRef(expanded)

  useEvent(window, "resize", () => {
    setViewportHeight(window.innerHeight)
    if (!expanded) y.set(window.innerHeight)
  })

  const pathWithoutPlayer = () => withoutSearchParam(path, search, "player")

  useEffect(() => {
    if (playerOpen && isDesktop) navigate(pathWithoutPlayer(), { replace: true })
    if (!playerOpen) restored.current = false
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerOpen, isDesktop])

  useEffect(() => {
    if (wasExpanded.current === expanded) return
    wasExpanded.current = expanded
    if (expanded) {
      if (restored.current) y.set(0)
      else animate(y, 0, playerSpring)
      restored.current = false
    } else {
      pushed.current = false
      animate(y, viewportHeight, { ...playerSpring, onComplete: () => setVisible(false) })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded])

  const open = () => {
    const params = new URLSearchParams(search)
    params.set("player", "open")
    pushed.current = true
    navigate(`${path}?${params}`)
  }

  const close = () => {
    if (pushed.current) {
      pushed.current = false
      history.back()
    } else {
      navigate(pathWithoutPlayer(), { replace: true })
    }
  }

  return {
    y,
    progress,
    viewportHeight,
    visible,
    expanded,
    open,
    close,
    drag: offsetY => {
      if (!visible) setVisible(true)
      y.stop()
      y.set(Math.min(viewportHeight, Math.max(0, viewportHeight + offsetY)))
    },
    release: (offsetY, velocityY) => {
      if (offsetY < -viewportHeight * OPEN_FRACTION || velocityY < -OPEN_VELOCITY) return open()
      animate(y, viewportHeight, { ...playerSpring, onComplete: () => setVisible(false) })
    },
  }
}
