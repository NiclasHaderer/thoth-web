import { forwardRef, ReactNode } from "react"
import { usePathname } from "wouter/use-browser-location"
import { Link } from "wouter"

type ActiveLinkProps = {
  withSubRoutes?: boolean
  href: string
  className?: string
  children: ReactNode
}

export const ActiveLink = forwardRef<HTMLAnchorElement, ActiveLinkProps>(
  ({ href, children, className, withSubRoutes }, ref) => {
    const pathname = usePathname()
    const isActive = withSubRoutes ? pathname.startsWith(href) : pathname === href
    return (
      <Link
        href={href}
        className={`group cursor-pointer transition-colors ${isActive ? "text-primary" : ""} ${className ?? ""}`}
        ref={ref}
      >
        {children}
      </Link>
    )
  }
)
ActiveLink.displayName = "ActiveLink"
