import React, { PropsWithChildren } from "react"
import Link from "next/link"
import { useRoute } from "wouter"

export const ActiveLink: React.FC<
  { href: string; withSubroutes?: boolean; className?: string } & PropsWithChildren
> = ({ href, children, className, withSubroutes }) => {
  const [isSubRoute] = useRoute(`${href}/:id`)
  const [isRoute] = useRoute(href)

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
