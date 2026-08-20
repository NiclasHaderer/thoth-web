import { LucideIcon } from "lucide-react"
import { FC } from "react"
import { useLocation } from "wouter"
import { Link } from "@thoth/components/link.tsx"
import { CollapsibleLabel } from "@thoth/components/menu/collapsible-label"
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

  return (
    <Link
      href={href}
      data-active={exact ? pathname === href : pathname.startsWith(href)}
      aria-label={collapsed ? label : undefined}
      className={cn(
        "text-muted-foreground [&_svg]:text-muted-foreground/70 hover:text-foreground data-active:bg-primary/10! data-active:text-foreground! data-active:[&_svg]:text-primary flex h-12 w-full items-center gap-3 rounded-lg pl-4 text-sm font-medium whitespace-nowrap transition-[color,background-color,padding] duration-150 outline-none focus-visible:ring-2 [&_svg]:size-4 [&_svg]:shrink-0",
        collapsed ? "hover:bg-muted hover:[&_svg]:text-foreground pr-0" : "pr-3"
      )}
    >
      <Icon />
      <CollapsibleLabel collapsed={collapsed}>
        <span className="truncate">{label}</span>
        {count ? <span className="text-muted-foreground ml-auto text-xs tabular-nums">{count}</span> : null}
      </CollapsibleLabel>
    </Link>
  )
}
