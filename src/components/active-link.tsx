import React, { FC, forwardRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

type ActiveLinkProps = Parameters<typeof Link>[0] & {
  withSubroutes?: boolean
  href: string
}

export const ActiveLink: FC<ActiveLinkProps> = forwardRef(
  ({ href, children, className, withSubroutes, ...props }, ref) => {
    const pathname = usePathname()
    const isActive = withSubroutes ? pathname.startsWith(href) : pathname === href
    return (
      <Link
        href={href}
        className={`group cursor-pointer transition-colors ${isActive ? "text-primary" : ""} ${className ?? ""}`}
        {...props}
        ref={ref}
      >
        {children}
      </Link>
    )
  }
)
ActiveLink.displayName = "ActiveLink"
