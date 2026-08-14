import { LucideIcon, PanelLeftCloseIcon, PanelLeftOpenIcon } from "lucide-react"
import { FC, ReactNode, useState } from "react"
import { Button } from "react-aria-components"
import { NavItem } from "@thoth/components/menu/nav-item"
import { cn } from "@thoth/lib/utils"

const COLLAPSED_KEY = "thoth-side-menu-collapsed"

export type SideMenuEntry = {
  href: string
  Icon: LucideIcon
  label: string
  count?: number
  exact?: boolean
}

export const SideMenu: FC<{
  header: (collapsed: boolean) => ReactNode
  items: SideMenuEntry[]
  className?: string
}> = ({ header, items, className }) => {
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(COLLAPSED_KEY) === "true")

  const toggleCollapsed = () => {
    setCollapsed(previous => {
      localStorage.setItem(COLLAPSED_KEY, String(!previous))
      return !previous
    })
  }

  const ToggleIcon = collapsed ? PanelLeftOpenIcon : PanelLeftCloseIcon

  return (
    <aside
      className={cn(
        "bg-card my-3 ml-3 flex shrink-0 flex-col overflow-hidden rounded-xl p-2 transition-[width] duration-200",
        collapsed ? "w-16" : "w-56",
        className
      )}
    >
      {header(collapsed)}

      <ul className="mt-2 flex flex-col gap-1">
        {items.map(item => (
          <li key={item.href}>
            <NavItem {...item} collapsed={collapsed} />
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-col gap-2 pt-2">
        <Button
          aria-label={collapsed ? "Expand menu" : "Collapse menu"}
          onPress={toggleCollapsed}
          className={cn(
            "text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:bg-muted flex size-10 cursor-pointer items-center justify-center rounded-lg transition-colors outline-none",
            collapsed ? "mx-auto" : "ml-auto"
          )}
        >
          <ToggleIcon className="size-4 shrink-0" />
        </Button>
      </div>
    </aside>
  )
}
