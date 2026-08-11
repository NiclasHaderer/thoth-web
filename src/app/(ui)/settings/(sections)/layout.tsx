import { FC, ReactNode, useEffect } from "react"
import { useLocation } from "wouter"
import { NavItem, accountItem, adminItems, adminPaths, licensesItem } from "@thoth/components/menu/settings-nav"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@thoth/components/ui/sidebar"
import { useOnMount } from "@thoth/hooks/lifecycle"
import { useIsMobile } from "@thoth/hooks/use-mobile"
import { useCurrentUserState } from "@thoth/state/current-user.state"

const menuButtonClassName =
  "text-muted-foreground [&_svg]:text-muted-foreground/70 hover:text-foreground data-active:bg-primary/10! data-active:text-foreground! data-active:[&_svg]:text-primary gap-3 rounded-lg px-3 font-medium"

const SettingsSidebar: FC<{ navItems: NavItem[] }> = ({ navItems }) => {
  const [pathname, navigate] = useLocation()

  return (
    <Sidebar collapsible="none" className="bg-card m-3 h-auto w-56 rounded-xl">
      <SidebarHeader className="px-4 pt-4">
        <h1 className="text-2xl font-semibold">Settings</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {navItems.map(({ href, Icon, label }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    size="lg"
                    isActive={pathname.startsWith(href)}
                    onPress={() => navigate(href)}
                    className={menuButtonClassName}
                  >
                    <Icon />
                    {label}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              isActive={pathname.startsWith(licensesItem.href)}
              onPress={() => navigate(licensesItem.href)}
              className={menuButtonClassName}
            >
              <licensesItem.Icon />
              {licensesItem.label}
            </SidebarMenuButton>
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
      {/* On mobile the sections live in the top-bar account menu instead. */}
      {isMobile ? null : <SettingsSidebar navItems={navItems} />}
      <main className="min-w-0 grow overflow-y-auto p-4 sm:p-8">{children}</main>
    </SidebarProvider>
  )
}
