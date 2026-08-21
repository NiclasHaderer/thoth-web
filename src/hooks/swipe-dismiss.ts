import { useEffect, useRef, useState } from "react"

const DISMISS_DISTANCE = 96

// Listeners go on the sheet panel natively: react-aria filters unknown DOM
// props off Modal, so pointer handlers passed as JSX never reach the element.
export const useSwipeDismiss = (onDismiss: () => void) => {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const dismiss = useRef(onDismiss)

  useEffect(() => {
    dismiss.current = onDismiss
  })

  useEffect(() => {
    const panel = anchor?.closest<HTMLElement>("[data-slot=sheet-content]")
    if (!panel) return

    let startY: number | null = null
    let travelled = 0

    panel.style.touchAction = "none"

    const down = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) return
      startY = event.clientY
      travelled = 0
      panel.style.transition = "none"
    }

    const move = (event: PointerEvent) => {
      if (startY === null) return
      travelled = Math.max(0, event.clientY - startY)
      if (travelled > 4 && !panel.hasPointerCapture(event.pointerId)) panel.setPointerCapture(event.pointerId)
      panel.style.transform = `translateY(${travelled}px)`
    }

    const release = (dismissable: boolean) => {
      if (startY === null) return
      startY = null
      panel.style.transition = ""
      if (dismissable && travelled > DISMISS_DISTANCE) dismiss.current()
      else panel.style.transform = ""
    }

    const up = () => release(true)
    const cancel = () => release(false)

    const click = (event: MouseEvent) => {
      if (travelled > 8) {
        event.preventDefault()
        event.stopPropagation()
      }
      travelled = 0
    }

    panel.addEventListener("pointerdown", down)
    panel.addEventListener("pointermove", move)
    panel.addEventListener("pointerup", up)
    panel.addEventListener("pointercancel", cancel)
    panel.addEventListener("click", click, true)

    return () => {
      panel.style.touchAction = ""
      panel.removeEventListener("pointerdown", down)
      panel.removeEventListener("pointermove", move)
      panel.removeEventListener("pointerup", up)
      panel.removeEventListener("pointercancel", cancel)
      panel.removeEventListener("click", click, true)
    }
  }, [anchor])

  return setAnchor
}
