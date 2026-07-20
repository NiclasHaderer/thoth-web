import { ComponentType, CSSProperties, Ref, useEffect, useRef, useState } from "react"
import { useIntersectionObserver } from "@thoth/hooks/intersection-observer"

export const ClearIfNotVisible = <T extends object, REF extends HTMLElement>({
  component: Component,
  childProps,
}: {
  component: ComponentType<{ ref: Ref<REF> } & T>
  childProps: T
}) => {
  // TODO make sure this really works (perhaps we need to save the elements on resize or more often)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const childRef = useRef<REF>(null)
  const visible = useIntersectionObserver(wrapperRef)
  const [placeHolderStyle, setPlaceHolderStyle] = useState<CSSProperties | undefined>(undefined)

  const setPlaceholderStyles = () => {
    if (!childRef.current) return
    const childElement = childRef.current
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
  }

  useEffect(setPlaceholderStyles, [visible])

  return (
    <div className="inline-block" style={visible ? undefined : placeHolderStyle} ref={wrapperRef}>
      {visible ? <Component {...childProps} ref={childRef} /> : null}
    </div>
  )
}
