import React, { FC, forwardRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

type ActiveLinkProps = Parameters<typeof Link>[0] & {
  withSubroutes?: boolean
  href: string
}

const isRoute = (route: string) => {
  if (typeof window === "undefined") return false
  return route === window.location.pathname
}

const isSubRoute = (route: string) => {
  if (typeof window === "undefined") return false
  return window.location.pathname.startsWith(route)
}

export const ActiveLink: FC<ActiveLinkProps> = forwardRef(
  ({ href, children, className, withSubroutes, ...props }, _) => {
    const pathname = usePathname()
    const isActive = withSubroutes ? pathname.startsWith(href) : pathname === href
    return (
      <Link
        href={href}
        className={`group cursor-pointer transition-colors ${isActive ? "text-primary" : ""} ${className ?? ""}`}
        {...props}
      >
        {children}
      </Link>
    )
  }
)
ActiveLink.displayName = "ActiveLink"
