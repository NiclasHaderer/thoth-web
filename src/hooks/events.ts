import { RefObject, useEffect, useRef } from "react"

type Target = Window | HTMLElement | RefObject<HTMLElement | null> | null

export function useEvent<T extends keyof WindowEventMap>(
  target: Window,
  type: T,
  listener: (event: WindowEventMap[T]) => unknown,
  options?: boolean | AddEventListenerOptions
): void
export function useEvent<T extends keyof HTMLElementEventMap>(
  target: HTMLElement | RefObject<HTMLElement | null> | null,
  type: T,
  listener: (event: HTMLElementEventMap[T]) => unknown,
  options?: boolean | AddEventListenerOptions
): void
export function useEvent(
  target: Target,
  type: string,
  listener: (event: never) => unknown,
  options?: boolean | AddEventListenerOptions
) {
  const currentListener = useRef(listener)

  useEffect(() => {
    currentListener.current = listener
  })

  useEffect(() => {
    const element = target && "current" in target ? target.current : target
    if (!element) return

    const handler = (event: Event) => currentListener.current(event as never)

    element.addEventListener(type, handler, options)
    return () => element.removeEventListener(type, handler, options)
  }, [target, type, options])
}
