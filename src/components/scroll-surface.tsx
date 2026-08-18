import { ComponentProps, createContext, ElementType, ReactNode, useContext, useLayoutEffect, useState } from "react"
import { useLocation } from "wouter"
import { hasListScroll } from "@thoth/state/list-scroll"

const CONTEXT = createContext<HTMLElement | null>(null)

type ScrollSurfaceProps<T extends ElementType> = { as?: T; children?: ReactNode } & Omit<
  ComponentProps<T>,
  "as" | "children" | "ref"
>

export function ScrollSurface<T extends ElementType = "div">({ as, children, ...props }: ScrollSurfaceProps<T>) {
  const Element = as ?? "div"
  const [surface, setSurface] = useState<HTMLElement | null>(null)
  const [location] = useLocation()

  useLayoutEffect(() => {
    if (hasListScroll(location)) return
    surface?.scrollTo(0, 0)
  }, [location, surface])

  return (
    <Element ref={setSurface} {...props}>
      <CONTEXT.Provider value={surface}>{children}</CONTEXT.Provider>
    </Element>
  )
}

export const useScrollSurface = () => useContext(CONTEXT)
