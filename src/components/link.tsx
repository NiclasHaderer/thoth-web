import { ComponentProps, FC, useEffect } from "react"
import { Link as WouterLink } from "wouter"
import { prefetchRoute } from "@thoth/routes.tsx"

type PrefetchMode = "render" | "intent" | "none"

type LinkProps = ComponentProps<"a"> & {
  href: string
  replace?: boolean
  state?: unknown
  prefetch?: PrefetchMode
}

const whenIdle = (task: () => void) => {
  // Safari being slow again https://caniuse.com/requestidlecallback
  if ("requestIdleCallback" in window) {
    const handle = requestIdleCallback(task)
    return () => cancelIdleCallback(handle)
  }
  const handle = setTimeout(task)
  return () => clearTimeout(handle)
}

export const Link: FC<LinkProps> = ({ prefetch = "render", ...props }) => {
  useEffect(() => {
    if (prefetch !== "render") return
    return whenIdle(() => prefetchRoute(props.href))
  }, [prefetch, props.href])

  const prefetchOnIntent = () => {
    if (prefetch !== "none") prefetchRoute(props.href)
  }

  return (
    <WouterLink
      {...props}
      onPointerEnter={event => {
        props.onPointerEnter?.(event)
        prefetchOnIntent()
      }}
      onFocus={event => {
        props.onFocus?.(event)
        prefetchOnIntent()
      }}
    />
  )
}
