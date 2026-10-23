import { animate, useMotionValue, useMotionValueEvent, useReducedMotion } from "motion/react"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { useLocation } from "wouter"

// Both screen edges belong to the system back gesture on iOS and Android.
const EDGE = 24
const DIRECTION_LOCK = 10
const COMMIT_FRACTION = 0.18
const FLICK_VELOCITY = 0.5
const END_RESISTANCE = 0.25
const EXIT_DURATION = 0.1
// a fast flick's velocity never overshoots.
const SETTLE = { type: "spring", stiffness: 700, damping: 53 } as const

// The clip parent spans the screen edge to edge, while the page sits inside its padding.
const travel = (element: HTMLElement) => (element.parentElement ?? element).offsetWidth

export const useSwipeNavigation = (pages: string[]) => {
  const [element, setElement] = useState<HTMLElement | null>(null)
  const [pathname, navigate] = useLocation()
  const x = useMotionValue(0)
  const [offset, setOffset] = useState(false)
  const index = pages.indexOf(pathname)
  const enabled = index !== -1
  const previous = enabled ? pages[index - 1] : undefined
  const next = enabled ? pages[index + 1] : undefined

  const reducedMotion = useReducedMotion()
  const shownIndex = useRef(index)
  const entrySpeed = useRef(0)
  const browserAnimated = useRef(false)

  useMotionValueEvent(x, "change", value => setOffset(value !== 0))

  // iOS Safari and Chrome on Android animate their edge-swipe Back themselves, and pages cannot turn that off. Sliding
  // the page in again on top would animate the same navigation twice.
  useEffect(() => {
    const onPopState = (event: PopStateEvent) => (browserAnimated.current = event.hasUAVisualTransition)
    window.addEventListener("popstate", onPopState, { capture: true })
    return () => window.removeEventListener("popstate", onPopState, { capture: true })
  }, [])

  // Every move between pages slides the new one in from its side, whether it came from a swipe, a chip or Back. A
  // layout effect, so the new page never paints in place first.
  useLayoutEffect(() => {
    const from = shownIndex.current
    shownIndex.current = index
    const speed = entrySpeed.current
    entrySpeed.current = 0
    const instant = reducedMotion || browserAnimated.current
    browserAnimated.current = false
    if (!element || from === -1 || index === -1 || from === index) return
    if (instant) return x.jump(0)
    const direction = index > from ? 1 : -1
    x.jump(direction * travel(element))
    void animate(x, 0, { ...SETTLE, velocity: -direction * speed * 1000 })
  }, [element, pathname, index, reducedMotion, x])

  useEffect(() => {
    if (!element || !enabled) return

    let start: { x: number; y: number } | null = null
    let last = { x: 0, time: 0 }
    let velocity = 0
    let horizontal: boolean | null = null

    const down = (event: PointerEvent) => {
      if (event.pointerType !== "touch") return
      if (event.clientX < EDGE || event.clientX > window.innerWidth - EDGE) return
      start = { x: event.clientX, y: event.clientY }
      last = { x: event.clientX, time: event.timeStamp }
      velocity = 0
      horizontal = null
    }

    const move = (event: PointerEvent) => {
      if (!start) return
      const dx = event.clientX - start.x
      const dy = event.clientY - start.y
      if (horizontal === null) {
        if (Math.hypot(dx, dy) < DIRECTION_LOCK) return
        horizontal = Math.abs(dx) > Math.abs(dy)
        if (!horizontal) {
          start = null
          return
        }
        // pan-y keeps the browser from claiming the swipe, so it never sends pointercancel itself. Without one, React
        // Aria's usePress (on cover links, via Pressable) treats the swipe as a press and clicks the link on release,
        // and its long press would open the context menu mid-swipe. usePress listens on the document, so dispatching
        // there cancels the press without reaching the handlers on this element.
        element.ownerDocument.dispatchEvent(
          new PointerEvent("pointercancel", { pointerId: event.pointerId, pointerType: "touch", bubbles: true })
        )
        // Keeps pointerup coming when the finger slides off the edge of the screen; without it the page stays offset.
        element.setPointerCapture(event.pointerId)
      }
      const elapsed = event.timeStamp - last.time
      if (elapsed > 0) velocity = (event.clientX - last.x) / elapsed
      last = { x: event.clientX, time: event.timeStamp }
      x.set((dx > 0 ? previous : next) ? dx : dx * END_RESISTANCE)
    }

    const up = (event: PointerEvent) => {
      if (!start || !horizontal) {
        start = null
        return
      }
      const dx = event.clientX - start.x
      start = null
      const target = dx > 0 ? previous : next
      const width = travel(element)
      if (!target || (Math.abs(dx) < width * COMMIT_FRACTION && Math.abs(velocity) < FLICK_VELOCITY)) {
        void animate(x, 0, SETTLE)
        return
      }
      const direction = Math.sign(dx)
      // The page leaves at the finger's speed when that beats EXIT_DURATION, and the next one arrives with it.
      const speed = Math.max(0, velocity * direction)
      const duration = Math.min(EXIT_DURATION, speed > 0 ? (width - Math.abs(dx)) / speed / 1000 : EXIT_DURATION)
      void animate(x, direction * width, { duration, ease: duration < EXIT_DURATION ? "linear" : "easeIn" }).then(
        () => {
          entrySpeed.current = speed
          navigate(target)
        }
      )
    }

    const cancel = () => {
      if (start && horizontal) void animate(x, 0, SETTLE)
      start = null
    }

    // Taking the capture makes the touched descendant lose its implicit one, and that event bubbles up here.
    const lostCapture = (event: PointerEvent) => {
      if (event.target === element) cancel()
    }

    element.addEventListener("pointerdown", down)
    element.addEventListener("pointermove", move)
    element.addEventListener("pointerup", up)
    element.addEventListener("pointercancel", cancel)
    element.addEventListener("lostpointercapture", lostCapture)
    return () => {
      element.removeEventListener("pointerdown", down)
      element.removeEventListener("pointermove", move)
      element.removeEventListener("pointerup", up)
      element.removeEventListener("pointercancel", cancel)
      element.removeEventListener("lostpointercapture", lostCapture)
    }
  }, [element, enabled, previous, next, navigate, x])

  return {
    setElement,
    // pan-y leaves vertical scrolling to the browser and hands horizontal movement to the handlers above.
    style: { x, touchAction: enabled ? "pan-y pinch-zoom" : undefined },
    // For the parent: clips the page while it slides, and only then, so real horizontal overflow stays visible.
    clipStyle: { overflowX: offset ? ("clip" as const) : undefined },
  }
}
