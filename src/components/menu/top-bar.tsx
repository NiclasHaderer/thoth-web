import { ChevronDownIcon, LogOutIcon, UserIcon, SettingsIcon } from "lucide-react"
import { FC, ReactNode } from "react"
import { Button, MenuTrigger } from "react-aria-components"
import { Link } from "wouter"
import { UUID } from "@thoth/client"
import { Logo } from "@thoth/components/icons/logo"
import { Search } from "@thoth/components/menu/search"
import { accountItem } from "@thoth/components/menu/settings-nav"
import { Avatar, AvatarFallback } from "@thoth/components/ui/avatar"
import { DropdownMenu, DropdownMenuItem } from "@thoth/components/ui/dropdown-menu"
import { useCurrentLibraryId } from "@thoth/hooks/current-library"
import { cn } from "@thoth/lib/utils"
import { useCurrentUser } from "@thoth/queries/current-user"

export const AppBar: FC = () => {
  const libraryId = useCurrentLibraryId()

  return (
    <div className="bg-card mx-3 mt-3 hidden h-16 min-h-16 shrink-0 items-center rounded-xl pr-3 md:flex">
      <LogoLink libraryId={libraryId} className="h-16" />
      <Search />
      <AccountMenu />
    </div>
  )
}

const LogoLink: FC<{ libraryId: UUID | undefined; className?: string }> = ({ libraryId, className }) => (
  <Link
    href={libraryId ? `/libraries/${libraryId}` : "/libraries"}
    className={cn(
      "focus-visible:bg-accent flex w-16 shrink-0 items-center justify-center rounded-l-xl transition-colors outline-none",
      className
    )}
    aria-label="Thoth home"
  >
    <Logo className="h-12 w-auto" />
  </Link>
)

interface AccountMenuItem {
  key: string
  label: string
  icon: ReactNode
  href: string
}

const AccountMenu: FC = () => {
  const { data: user } = useCurrentUser()
  const initial = user?.username ? user.username.charAt(0).toUpperCase() : <UserIcon className="h-5 w-5" />

  const menuItems: AccountMenuItem[] = [
    {
      key: "account",
      label: "Account",
      icon: (
        <Avatar className="size-5">
          <AvatarFallback className="text-xs">
            {user?.username ? user.username.charAt(0).toUpperCase() : <UserIcon className="h-3.5 w-3.5" />}
          </AvatarFallback>
        </Avatar>
      ),
      href: accountItem.href,
    },
    ...(user?.permissions?.isAdmin
      ? [
          {
            key: "settings",
            label: "Settings",
            icon: <SettingsIcon className="size-5" />,
            href: "/settings/libraries",
          },
        ]
      : []),
    { key: "logout", label: "Logout", icon: <LogOutIcon className="size-5" />, href: "/logout" },
  ]

  return (
    <MenuTrigger>
      <Button
        id="user-account-menu"
        className="group bg-popover hover:bg-accent focus-visible:bg-accent flex h-12 cursor-pointer items-center gap-1.5 rounded-full p-1 transition-colors outline-none sm:pr-3"
      >
        <Avatar size="lg">
          <AvatarFallback>{initial}</AvatarFallback>
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
  )
}
