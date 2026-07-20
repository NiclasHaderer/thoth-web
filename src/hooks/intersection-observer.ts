import { RefObject, useEffect, useState } from "react"

export const useIntersectionObserver = (target: RefObject<HTMLElement | null>, scrollElement?: HTMLElement) => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const element = target.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.intersectionRatio > 0), {
      root: scrollElement ?? document.body,
      threshold: [0, 0.01],
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [target, scrollElement])

  return visible
}
