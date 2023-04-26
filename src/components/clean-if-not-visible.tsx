import React, { CSSProperties, ReactElement, useEffect, useRef, useState } from "react"
import { useIntersectionObserver } from "@thoth/hooks/intersection-observer"

export const CleanIfNotVisible: React.VFC<{ children: ReactElement }> = ({ children }) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const visible = useIntersectionObserver(wrapperRef.current)
  const [placeHolderStyle, setPlaceHolderStyle] = useState<CSSProperties | undefined>(undefined)

  useEffect(() => {
    const childElement: HTMLElement = (children as any).__e
    if (!childElement) return

    const newState = {
      height: childElement.clientHeight,
      width: childElement.clientWidth,
    }

    setPlaceHolderStyle(currentState => {
      if (currentState?.height === newState.height && currentState?.width === newState.width) {
        return currentState
      }
      return newState
    })
  }, [children])

  return (
    <div className="inline-block" style={visible ? undefined : placeHolderStyle} ref={wrapperRef}>
      {visible ? children : null}
    </div>
  )
}
