import { useEffect, useState } from "react"
import { useIntersectionObserver } from "./intersection-observer"
import { useOnMount } from "@thoth/hooks/lifecycle"

export const useInfinityScroll = (target: HTMLElement | null, fetchNext: (index: number) => void, startIndex = 0) => {
  const [index, setIndex] = useState(startIndex)
  const visible = useIntersectionObserver(target)

  useOnMount(() => fetchNext(index))

  useEffect(() => {
    if (!visible) return
    setIndex(i => i + 1)
    fetchNext(index)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])
}
