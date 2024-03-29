import { useEffect, useState } from "react"

export const useIntersectionObserver = (target: HTMLElement | null, scrollElement?: HTMLElement) => {
  const [visible, setVisible] = useState(false)
  const callback = ([entry]: IntersectionObserverEntry[], _: IntersectionObserver) => {
    setVisible(entry.intersectionRatio > 0)
  }

  useEffect(() => {
    if (!target) return
    const observer = new IntersectionObserver(callback, { root: scrollElement ?? document.body, threshold: [0, 0.01] })
    observer.observe(target)
    return () => observer.disconnect()
  })
  return visible
}
