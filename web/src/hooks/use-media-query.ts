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

// Matches when the viewport is at least the given Tailwind breakpoint, read from
// the actual `--breakpoint-*` token so it stays in sync with the theme.
export const useBreakpoint = (breakpoint: Breakpoint): boolean => {
  const [query] = useState(() => {
    if (typeof window === "undefined") return "(max-width: 0px)"
    const value = getComputedStyle(document.documentElement).getPropertyValue(`--breakpoint-${breakpoint}`).trim()
    return value ? `(min-width: ${value})` : "(max-width: 0px)"
  })

  return useMediaQuery(query)
}
