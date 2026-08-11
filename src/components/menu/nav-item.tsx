import { LucideIcon } from "lucide-react"
import { FC } from "react"
import { Link, useLocation } from "wouter"

export const NavItem: FC<{ href: string; Icon: LucideIcon; label: string; count?: number }> = ({
  href,
  Icon,
  label,
  count,
}) => {
  const [pathname] = useLocation()

  return (
    <Link
      href={href}
      data-active={pathname.startsWith(href)}
      className="text-muted-foreground [&_svg]:text-muted-foreground/70 hover:text-foreground data-active:bg-primary/10! data-active:text-foreground! data-active:[&_svg]:text-primary flex h-12 w-full items-center justify-start gap-3 rounded-lg px-3 text-sm font-medium transition-colors outline-none focus-visible:ring-2 [&_svg]:size-4 [&_svg]:shrink-0"
    >
      <Icon />
      {label}
      {count ? <span className="text-muted-foreground ml-auto text-xs tabular-nums">{count}</span> : null}
    </Link>
  )
}
