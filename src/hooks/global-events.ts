import { useEffect, useRef } from "react"

export function useGlobalEvent<T extends keyof WindowEventMap>(
  type: T,
  listener: (event: WindowEventMap[T]) => unknown,
  filter?: (event: WindowEventMap[T]) => boolean,
  options?: boolean | AddEventListenerOptions
) {
  const currentListener = useRef(listener)
  const currentFilter = useRef(filter)

  useEffect(() => {
    currentListener.current = listener
    currentFilter.current = filter
  })

  useEffect(() => {
    const handler = (event: WindowEventMap[T]) => {
      if (currentFilter.current && !currentFilter.current(event)) return
      currentListener.current(event)
    }

    window.addEventListener(type, handler, options)
    return () => window.removeEventListener(type, handler, options)
  }, [type, options])
}
