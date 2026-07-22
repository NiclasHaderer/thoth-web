import { BookMarkedIcon, LucideIcon, ScaleIcon, UserIcon, UsersIcon } from "lucide-react"
import { FC, ReactNode, useEffect, useRef } from "react"
import { useMove } from "react-aria"
import { useLocation } from "wouter"
import { Sheet } from "@thoth/components/ui/sheet"
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
  SidebarTrigger,
  useSidebar,
} from "@thoth/components/ui/sidebar"
import { useOnMount } from "@thoth/hooks/lifecycle"
import { useIsMobile } from "@thoth/hooks/use-mobile"
import { useCurrentUserState } from "@thoth/state/current-user.state"

type NavItem = { href: string; Icon: LucideIcon; label: string }

const accountItem: NavItem = { href: "/settings/account", Icon: UserIcon, label: "Account" }
const licensesItem: NavItem = { href: "/settings/licenses", Icon: ScaleIcon, label: "Open source licenses" }
const adminItems: NavItem[] = [
  { href: "/settings/libraries", Icon: BookMarkedIcon, label: "Libraries" },
  { href: "/settings/users", Icon: UsersIcon, label: "Users" },
]
const adminPaths = adminItems.map(i => i.href)

const SettingsSidebar: FC<{ navItems: NavItem[]; isMobile: boolean }> = ({ navItems, isMobile }) => {
  const [pathname, navigate] = useLocation()
  const { openMobile, setOpenMobile } = useSidebar()

  const go = (href: string) => {
    navigate(href)
    setOpenMobile(false)
  }

  // Swipe-to-dismiss for the mobile drawer, mirroring the top-bar account menu
  // but flipped for the left edge the sidebar slides in from.
  const swipeRef = useRef<HTMLDivElement>(null)
  const dragX = useRef(0)
  const panel = () => swipeRef.current?.closest<HTMLElement>("[data-slot=sheet-content]") ?? null
  const { moveProps } = useMove({
    onMoveStart: () => {
      dragX.current = 0
      const el = panel()
      if (el) el.style.transition = "none"
    },
    onMove: e => {
      // Follow the finger, but only leftward (the edge it slid in from).
      dragX.current = Math.min(0, dragX.current + e.deltaX)
      const el = panel()
      if (el) el.style.transform = `translateX(${dragX.current}px)`
    },
    onMoveEnd: () => {
      const el = panel()
      if (!el) return
      if (dragX.current < -80) {
        el.style.transition = ""
        el.style.transform = ""
        setOpenMobile(false)
      } else {
        // Snap back, then drop the inline styles so the normal animation works again.
        el.style.transition = "transform 0.2s ease"
        el.style.transform = "translateX(0px)"
        el.addEventListener(
          "transitionend",
          () => {
            el.style.transition = ""
            el.style.transform = ""
          },
          { once: true }
        )
      }
    },
  })

  const nav = (
    <>
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
                    onPress={() => go(href)}
                    className="text-muted-foreground [&_svg]:text-muted-foreground/70 hover:text-foreground data-active:bg-primary/10! data-active:text-foreground! data-active:[&_svg]:text-primary gap-3 rounded-lg px-3 font-medium"
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
              onPress={() => go(licensesItem.href)}
              className="text-muted-foreground [&_svg]:text-muted-foreground/70 hover:text-foreground data-active:bg-primary/10! data-active:text-foreground! data-active:[&_svg]:text-primary gap-3 rounded-lg px-3 font-medium"
            >
              <licensesItem.Icon />
              {licensesItem.label}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  )

  // Mobile: a left-edge Sheet with the same full-slide + fade animation as the
  // top-bar account menu. Desktop: a static in-flow panel.
  if (isMobile) {
    return (
      <Sheet
        side="left"
        isOpen={openMobile}
        onOpenChange={setOpenMobile}
        className="w-72 data-[side=left]:data-entering:-translate-x-full data-[side=left]:data-exiting:-translate-x-full"
      >
        <div ref={swipeRef} className="flex h-full touch-none flex-col" {...moveProps}>
          {nav}
        </div>
      </Sheet>
    )
  }

  return (
    <Sidebar collapsible="none" className="bg-card m-3 h-auto w-56 rounded-xl">
      {nav}
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
      <SettingsSidebar navItems={navItems} isMobile={isMobile} />
      <main className="min-w-0 grow overflow-y-auto p-4 sm:p-8">
        <SidebarTrigger aria-label="Open settings menu" className="float-left mr-2 md:hidden" />
        {children}
      </main>
    </SidebarProvider>
  )
}
