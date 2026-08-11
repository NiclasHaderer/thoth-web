import { ChevronDownIcon, LogOutIcon, UserIcon, SettingsIcon } from "lucide-react"
import { FC, ReactNode, useRef, useState } from "react"
import { useMove } from "react-aria"
import { Button, MenuTrigger } from "react-aria-components"
import { Link } from "wouter"
import { Logo } from "@thoth/components/icons/logo"
import { Search } from "@thoth/components/menu/search"
import { NavEntry, accountItem, adminItems, licensesItem } from "@thoth/components/menu/settings-nav"
import { Avatar, AvatarFallback } from "@thoth/components/ui/avatar"
import { buttonVariants } from "@thoth/components/ui/button"
import { ButtonGroup } from "@thoth/components/ui/button-group"
import { DropdownMenu, DropdownMenuItem } from "@thoth/components/ui/dropdown-menu"
import { Sheet, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@thoth/components/ui/sheet"
import { useOnMount } from "@thoth/hooks/lifecycle.ts"
import { useCurrentUserState } from "@thoth/state/current-user.state"

interface AccountMenuItem {
  key: string
  label: string
  icon: ReactNode
  href: string
}

export const SearchBar: FC = () => {
  const result = useCurrentUserState(s => s.user)
  const fetchCurrentUser = useCurrentUserState(s => s.fetchCurrentUser)
  useOnMount(() => void fetchCurrentUser())

  const [sheetOpen, setSheetOpen] = useState(false)
  const sheetContentRef = useRef<HTMLDivElement>(null)
  const dragX = useRef(0)
  const panel = () => sheetContentRef.current?.closest<HTMLElement>("[data-slot=sheet-content]") ?? null

  const { moveProps } = useMove({
    onMoveStart: () => {
      dragX.current = 0
      const el = panel()
      if (el) el.style.transition = "none"
    },
    onMove: e => {
      // Follow the finger, but only rightward (the edge it slid in from).
      dragX.current = Math.max(0, dragX.current + e.deltaX)
      const el = panel()
      if (el) el.style.transform = `translateX(${dragX.current}px)`
    },
    onMoveEnd: () => {
      const el = panel()
      if (!el) return
      if (dragX.current > 80) {
        el.style.transition = ""
        el.style.transform = ""
        setSheetOpen(false)
      } else {
        // Snap back into place, then drop the inline styles so the normal
        // open/close animation classes work again.
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

  const bigInitial = result?.username ? result.username.charAt(0).toUpperCase() : <UserIcon className="h-5 w-5" />

  const accountMenuItem: AccountMenuItem = {
    key: "account",
    label: "Account",
    icon: (
      <Avatar className="size-5">
        <AvatarFallback className="text-xs">
          {result?.username ? result.username.charAt(0).toUpperCase() : <UserIcon className="h-3.5 w-3.5" />}
        </AvatarFallback>
      </Avatar>
    ),
    href: accountItem.href,
  }
  const logoutMenuItem: AccountMenuItem = {
    key: "logout",
    label: "Logout",
    icon: <LogOutIcon className="size-5" />,
    href: "/logout",
  }
  const toMenuItem = ({ href, Icon, label }: NavEntry): AccountMenuItem => ({
    key: href,
    label,
    icon: <Icon className="size-5" />,
    href,
  })

  const menuItems: AccountMenuItem[] = [
    accountMenuItem,
    ...(result?.permissions?.isAdmin
      ? [
          {
            key: "settings",
            label: "Server Settings",
            icon: <SettingsIcon className="size-5" />,
            href: "/settings/libraries",
          },
        ]
      : []),
    logoutMenuItem,
  ]

  const mobileMenuItems: AccountMenuItem[] = [
    accountMenuItem,
    ...(result?.permissions?.isAdmin ? adminItems.map(toMenuItem) : []),
    logoutMenuItem,
  ]
  const licensesMenuItem = toMenuItem(licensesItem)

  return (
    <div className="bg-card mx-3 mt-3 flex h-20 min-h-20 items-center rounded-xl pr-3">
      <Link
        href={"/libraries"}
        className="focus-visible:bg-accent flex overflow-hidden rounded-l-xl transition-colors outline-none"
        aria-label="Thoth home"
      >
        <div className="inline-flex cursor-pointer items-center sm:pr-2">
          <Logo className="h-20 w-auto p-3" />
          <h1 className="hidden font-serif text-3xl font-extrabold sm:block">THOTH</h1>
        </div>
      </Link>
      <Search />

      {/* Desktop: dropdown menu */}
      <div className="hidden md:block">
        <MenuTrigger>
          <Button
            id="user-account-menu"
            className="group bg-popover hover:bg-accent focus-visible:bg-accent flex h-12 cursor-pointer items-center gap-1.5 rounded-full p-1 transition-colors outline-none sm:pr-3"
          >
            <Avatar size="lg">
              <AvatarFallback>{bigInitial}</AvatarFallback>
            </Avatar>
            <ChevronDownIcon className="text-muted-foreground h-4 w-4 transition-transform duration-200 group-aria-expanded:rotate-180" />
          </Button>
          <DropdownMenu placement="bottom end" className="w-60">
            {menuItems.map(item => (
              <DropdownMenuItem key={item.key} className="gap-2.5 px-2.5 py-2 text-sm" href={item.href}>
                {item.icon}
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenu>
        </MenuTrigger>
      </div>

      {/* Mobile: slide-in sheet */}
      <div className="md:hidden">
        <SheetTrigger isOpen={sheetOpen} onOpenChange={setSheetOpen}>
          <Button
            aria-label="Open account menu"
            className="bg-popover hover:bg-accent focus-visible:bg-accent flex h-12 cursor-pointer items-center rounded-full p-1 transition-colors outline-none"
          >
            <Avatar size="lg">
              <AvatarFallback>{bigInitial}</AvatarFallback>
            </Avatar>
          </Button>
          <Sheet
            side="right"
            className="data-[side=right]:w-full data-[side=right]:data-entering:translate-x-full data-[side=right]:data-exiting:translate-x-full"
          >
            <div ref={sheetContentRef} className="flex h-full touch-none flex-col gap-4" {...moveProps}>
              <SheetHeader className="items-center gap-2 pt-8 text-center">
                <Avatar className="size-16">
                  <AvatarFallback className="text-xl font-medium">{bigInitial}</AvatarFallback>
                </Avatar>
                <SheetTitle className="text-lg">{result?.username ? `Hi, ${result.username}!` : "Account"}</SheetTitle>
                <SheetDescription>{result?.permissions?.isAdmin ? "Admin" : "User"}</SheetDescription>
              </SheetHeader>
              <div className="px-4">
                <ButtonGroup orientation="vertical" className="w-full">
                  {mobileMenuItems.map(item => (
                    <Link
                      key={item.key}
                      href={item.href}
                      onClick={() => setSheetOpen(false)}
                      className={buttonVariants({
                        variant: "outline",
                        className:
                          "h-14 justify-start gap-4 px-4 text-base font-normal [&_svg:not([class*='size-'])]:size-5",
                      })}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  ))}
                </ButtonGroup>
              </div>
              <div className="mt-auto px-4 pb-4">
                <Link
                  href={licensesMenuItem.href}
                  onClick={() => setSheetOpen(false)}
                  className={buttonVariants({
                    variant: "ghost",
                    className:
                      "text-muted-foreground h-14 w-full justify-start gap-4 px-4 text-base font-normal [&_svg:not([class*='size-'])]:size-5",
                  })}
                >
                  {licensesMenuItem.icon}
                  {licensesMenuItem.label}
                </Link>
              </div>
            </div>
          </Sheet>
        </SheetTrigger>
      </div>
    </div>
  )
}
