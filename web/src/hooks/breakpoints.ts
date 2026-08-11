import { useEffect, useMemo, useState } from "react"

type Breakpoints = "sm" | "md" | "lg" | "xl" | "2xl"
export const CHANGE_LAYOUT = "md"

const SIZES: Record<Breakpoints, number> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": Number.POSITIVE_INFINITY,
}

interface Breakpoint {
  matchDown(size: Breakpoints): boolean
}

const getWidth = () => (typeof window !== "undefined" ? window.innerWidth : 0)

const crossesBreakpoint = (width: number, newWidth: number) =>
  Object.values(SIZES).some(size => width < size !== newWidth < size)

export const useBreakpoint = (): Breakpoint => {
  const [width, setWidth] = useState(getWidth)

  useEffect(() => {
    const calcWidth = () => {
      const newWidth = getWidth()
      setWidth(current => (crossesBreakpoint(current, newWidth) ? newWidth : current))
    }

    window.addEventListener("resize", calcWidth)
    return () => window.removeEventListener("resize", calcWidth)
  }, [])

  return useMemo(() => ({ matchDown: (size: Breakpoints) => width < SIZES[size] }), [width])
}
