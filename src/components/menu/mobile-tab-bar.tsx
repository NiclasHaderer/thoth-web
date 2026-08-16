import { FC } from "react"
import {
  IoGrid,
  IoGridOutline,
  IoHome,
  IoHomeOutline,
  IoPerson,
  IoPersonOutline,
  IoSearch,
  IoSearchOutline,
} from "react-icons/io5"
import { Link, useLocation } from "wouter"
import { useCurrentLibraryId } from "@thoth/hooks/current-library"
import { cn } from "@thoth/lib/utils"
import { useLibraries } from "@thoth/queries/libraries"

const scrollContentToTop = () => {
  document.querySelector("main")?.scrollTo({ top: 0, behavior: "smooth" })
  document.querySelector("[data-scroll-area]")?.scrollTo({ top: 0, behavior: "smooth" })
}

export const MobileTabBar: FC = () => {
  const [pathname] = useLocation()
  const currentLibraryId = useCurrentLibraryId()
  const libraries = useLibraries().data ?? []

  const libraryId = currentLibraryId ?? libraries[0]?.id
  const home = libraryId ? `/libraries/${libraryId}` : "/libraries"

  const tabs = [
    { href: home, Icon: IoHomeOutline, ActiveIcon: IoHome, label: "Home", active: pathname === home },
    {
      href: libraryId ? `${home}/books` : "/libraries",
      Icon: IoGridOutline,
      ActiveIcon: IoGrid,
      label: "Browse",
      active: pathname.startsWith("/libraries/") && pathname !== home,
    },
    {
      href: "/search",
      Icon: IoSearchOutline,
      ActiveIcon: IoSearch,
      label: "Search",
      active: pathname.startsWith("/search"),
    },
    {
      href: "/you",
      Icon: IoPersonOutline,
      ActiveIcon: IoPerson,
      label: "You",
      active: ["/you", "/settings", "/account"].some(path => pathname.startsWith(path)),
    },
  ]

  return (
    <nav className="flex h-14 [touch-action:manipulation] items-stretch select-none [-webkit-tap-highlight-color:transparent] md:hidden">
      {tabs.map(({ href, Icon, ActiveIcon, label, active }) => (
        <Link
          key={label}
          href={href}
          aria-current={active ? "page" : undefined}
          onClick={() => active && scrollContentToTop()}
          className={cn(
            "focus-visible:ring-ring/50 flex flex-1 flex-col items-center justify-center gap-1 rounded-md text-[10px] font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-3",
            active ? "text-primary" : "text-muted-foreground"
          )}
        >
          <span className="relative size-6">
            <Icon aria-hidden className="absolute size-6" />
            <ActiveIcon
              aria-hidden
              className={cn(
                "absolute size-6 transition-[clip-path] duration-300 ease-out motion-reduce:transition-none",
                active ? "[clip-path:inset(0_0_0_0)]" : "[clip-path:inset(100%_0_0_0)]"
              )}
            />
          </span>
          {label}
        </Link>
      ))}
    </nav>
  )
}
