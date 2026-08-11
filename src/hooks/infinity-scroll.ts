import { RefObject, useEffect, useRef } from "react"
import { useOnMount } from "@thoth/hooks/lifecycle"
import { useIntersectionObserver } from "./intersection-observer"

export const useInfinityScroll = (
  target: RefObject<HTMLElement | null>,
  fetchNext: (index: number) => void,
  startIndex = 0
) => {
  const index = useRef(startIndex)
  const visible = useIntersectionObserver(target)

  useOnMount(() => {
    fetchNext(index.current)
    index.current += 1
  })

  useEffect(() => {
    if (!visible) return
    fetchNext(index.current)
    index.current += 1
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])
}
