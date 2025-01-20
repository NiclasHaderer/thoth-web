import { useEffect, useState } from "react"

type Breakpoints = "sm" | "md" | "lg" | "xl" | "2xl"
export const CHANGE_LAYOUT = "md"

interface Breakpoint {
  matchDown(size: Breakpoints): boolean
}

const getDeviceConfig = (): Breakpoint => {
  const width = typeof window !== "undefined" ? window.innerWidth : 0
  return {
    matchDown(size: Breakpoints) {
      switch (size) {
        case "sm":
          return width < 640
        case "md":
          return width < 768
        case "lg":
          return width < 1024
        case "xl":
          return width < 1280
        case "2xl":
          return true
      }
    },
  }
}

export const useBreakpoint = () => {
  const [breakPoint, setBreakPoint] = useState(() => getDeviceConfig())

  useEffect(() => {
    const calcWidth = () => {
      setBreakPoint(getDeviceConfig())
    }

    window.addEventListener("resize", calcWidth)
    return () => window.removeEventListener("resize", calcWidth)
  })

  return breakPoint
}
