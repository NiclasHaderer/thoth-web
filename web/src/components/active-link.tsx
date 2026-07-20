import { createElement, forwardRef, ReactNode } from "react"
import { Link, useLocation } from "wouter"

type ActiveLinkProps = {
  withSubRoutes?: boolean
  href: string
  className?: string
  children: ReactNode
  as?: "a" | "button"
  onClick?: () => void
}

export const ActiveLink = forwardRef<HTMLAnchorElement, ActiveLinkProps>(
  ({ href, children, className, withSubRoutes, as = "a", onClick }, ref) => {
    const [pathname] = useLocation()
    const isActive = withSubRoutes ? pathname.startsWith(href) : pathname === href
    return (
      <Link href={href} asChild onClick={onClick}>
        {createElement(as, {
          className: `group cursor-pointer transition-colors hover:bg-active-light ${isActive ? "text-primary" : ""} ${className ?? ""}`,
          ref,
          children,
        })}
      </Link>
    )
  }
)
ActiveLink.displayName = "ActiveLink"
