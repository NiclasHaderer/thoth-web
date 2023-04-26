import React, { PropsWithChildren } from "react"
import Link from "next/link"

export const ActiveLink: React.FC<
  { href: string; withSubroutes?: boolean; className?: string } & PropsWithChildren
> = ({ href, children, className, withSubroutes }) => {
  // TODO: Fix this
  const isSubRoute = false,
    isRoute = false

  const isActive = withSubroutes ? isSubRoute || isRoute : isRoute
  return (
    <Link
      href={href}
      className={`group cursor-pointer transition-colors ${isActive ? "text-primary" : ""} ${className ?? ""}`}
    >
      {children}
    </Link>
  )
}
