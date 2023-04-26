import React, { FC, forwardRef } from "react"
import Link from "next/link"

type ActiveLinkProps = Parameters<typeof Link>[0] & {
  withSubroutes?: boolean
}

export const ActiveLink: FC<ActiveLinkProps> = forwardRef(
  ({ href, children, className, withSubroutes, ...props }, _) => {
    const isSubRoute = false,
      isRoute = false

    const isActive = withSubroutes ? isSubRoute || isRoute : isRoute
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
