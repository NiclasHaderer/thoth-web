import { FC, ReactNode, useEffect } from "react"
import { useLocation } from "wouter"
import { NavItem } from "@thoth/components/menu/nav-item"
import { NavEntry, accountItem, adminItems, adminPaths, licensesItem } from "@thoth/components/menu/settings-nav"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
} from "@thoth/components/ui/sidebar"
import { useOnMount } from "@thoth/hooks/lifecycle"
import { useIsMobile } from "@thoth/hooks/use-mobile"
import { useCurrentUserState } from "@thoth/state/current-user.state"

const SettingsSidebar: FC<{ navItems: NavEntry[] }> = ({ navItems }) => {
  return (
    <Sidebar collapsible="none" className="bg-card m-3 h-auto w-56 rounded-xl">
      <SidebarHeader className="px-4 pt-4">
        <h1 className="text-2xl font-semibold">Settings</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {navItems.map(item => (
                <SidebarMenuItem key={item.href}>
                  <NavItem {...item} />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <NavItem {...licensesItem} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export const SettingsLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const user = useCurrentUserState(s => s.user)
  const fetchCurrentUser = useCurrentUserState(s => s.fetchCurrentUser)
  const [pathname, navigate] = useLocation()
  const isMobile = useIsMobile()

  useOnMount(() => void fetchCurrentUser())

  const isAdmin = user?.permissions.isAdmin ?? false

  // Account is available to everyone; the admin sections are not. Bounce a
  // non-admin who lands on an admin-only path back to their account page.
  useEffect(() => {
    if (user && !isAdmin && adminPaths.some(p => pathname.startsWith(p))) navigate("/settings/account")
  }, [user, isAdmin, pathname, navigate])

  // Wait until we know who the user is before rendering the (partly admin-only) nav.
  if (!user) return null

  const navItems = isAdmin ? [accountItem, ...adminItems] : [accountItem]

  return (
    <SidebarProvider className="h-full min-h-0!">
      {isMobile ? null : <SettingsSidebar navItems={navItems} />}
      <main className="flex min-w-0 grow flex-col overflow-y-auto p-4 sm:p-8">{children}</main>
    </SidebarProvider>
  )
}
