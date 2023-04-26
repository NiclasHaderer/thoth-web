import { useEffect, useState } from "react"
import { useIntersectionObserver } from "./intersection-observer"

export const useInfinityScroll = (target: HTMLElement | null, fetchNext: (index: number) => void, startIndex = 0) => {
  const [index, setIndex] = useState(startIndex)
  const visible = useIntersectionObserver(target)

  useEffect(() => {
    if (!visible) return
    setIndex(i => i + 1)
  }, [visible])

  useEffect(() => {
    fetchNext(index)
  }, [fetchNext, index])
}
