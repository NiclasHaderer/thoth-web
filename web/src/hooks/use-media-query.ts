import { useEffect, useState } from "react"

const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false
  )

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [query])

  return matches
}

type Breakpoint = "sm" | "md" | "lg" | "xl" | "2xl"

const breakpoints: Record<Breakpoint, string> = {
  sm: "40rem",
  md: "48rem",
  lg: "64rem",
  xl: "80rem",
  "2xl": "96rem",
}

export const useBreakpoint = (breakpoint: Breakpoint): boolean =>
  useMediaQuery(`(min-width: ${breakpoints[breakpoint]})`)
