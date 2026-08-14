import { LucideIcon } from "lucide-react"
import { FC } from "react"
import { Link, useLocation } from "wouter"
import { Tooltip, TooltipTrigger } from "@thoth/components/ui/tooltip"
import { cn } from "@thoth/lib/utils"

export const NavItem: FC<{
  href: string
  Icon: LucideIcon
  label: string
  count?: number
  exact?: boolean
  collapsed?: boolean
}> = ({ href, Icon, label, count, exact = false, collapsed = false }) => {
  const [pathname] = useLocation()

  const link = (
    <Link
      href={href}
      data-active={exact ? pathname === href : pathname.startsWith(href)}
      aria-label={collapsed ? label : undefined}
      className={cn(
        "text-muted-foreground [&_svg]:text-muted-foreground/70 hover:text-foreground data-active:bg-primary/10! data-active:text-foreground! data-active:[&_svg]:text-primary flex h-12 w-full items-center gap-3 rounded-lg text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-2 [&_svg]:size-4 [&_svg]:shrink-0",
        collapsed ? "justify-center px-0" : "justify-start px-3"
      )}
    >
      <Icon />
      {collapsed ? null : (
        <>
          {label}
          {count ? <span className="text-muted-foreground ml-auto text-xs tabular-nums">{count}</span> : null}
        </>
      )}
    </Link>
  )

  if (!collapsed) return link

  return (
    <TooltipTrigger>
      {link}
      <Tooltip placement="right">{label}</Tooltip>
    </TooltipTrigger>
  )
}
