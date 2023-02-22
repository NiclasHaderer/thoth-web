import React, { AnchorHTMLAttributes } from "react"
import { Link, useRoute } from "wouter"

export const ActiveLink: React.FC<{ href: string; withSubroutes?: boolean; className?: string }> = ({
  href,
  children,
  className,
  withSubroutes,
}) => {
  const [isSubRoute] = useRoute(`${href}/:id`)
  const [isRoute] = useRoute(href)

  const isActive = withSubroutes ? isSubRoute || isRoute : isRoute
  return (
    <Link href={href}>
      <a
        href={href}
        className={`group cursor-pointer transition-colors ${isActive ? "text-primary" : ""} ${className ?? ""}`}
      >
        {children}
      </a>
    </Link>
  )
}

interface ALinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
}

export const ALink: React.FC<ALinkProps> = ({ href, children, onClick, className, ...props }) => {
  return (
    <Link href={href} onClick={onClick}>
      <a href={href} className={`group ${className ?? ""}`} {...props}>
        {children}
      </a>
    </Link>
  )
}
