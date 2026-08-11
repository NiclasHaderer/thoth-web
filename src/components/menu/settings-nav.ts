import { BookMarkedIcon, LucideIcon, ScaleIcon, UserIcon, UsersIcon } from "lucide-react"

export type NavItem = { href: string; Icon: LucideIcon; label: string }

export const accountItem: NavItem = { href: "/settings/account", Icon: UserIcon, label: "Account" }
export const licensesItem: NavItem = { href: "/settings/licenses", Icon: ScaleIcon, label: "Open source licenses" }
export const adminItems: NavItem[] = [
  { href: "/settings/libraries", Icon: BookMarkedIcon, label: "Libraries" },
  { href: "/settings/users", Icon: UsersIcon, label: "Users" },
]
export const adminPaths = adminItems.map(i => i.href)
