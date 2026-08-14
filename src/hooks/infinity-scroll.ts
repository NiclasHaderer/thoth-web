import { RefObject, useEffect } from "react"
import { useIntersectionObserver } from "./intersection-observer"

export const useInfinityScroll = (target: RefObject<HTMLElement | null>, fetchNext: () => void, canFetch: boolean) => {
  const visible = useIntersectionObserver(target)

  useEffect(() => {
    if (!visible || !canFetch) return
    fetchNext()
  }, [visible, canFetch, fetchNext])
}
