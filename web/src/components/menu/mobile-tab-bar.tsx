import { FC, useState } from "react"
import { useLocation } from "wouter"
import { BrowseTabIcon, HomeTabIcon, SearchTabIcon, TabIconProps, YouTabIcon } from "@thoth/components/icons/tab-icons"
import { Link } from "@thoth/components/link.tsx"
import { useCurrentLibraryId } from "@thoth/hooks/current-library"
import { cn } from "@thoth/lib/utils"
import { useLibraries } from "@thoth/queries/libraries"

const focusSearchInput = () => {
  const input = document.querySelector<HTMLInputElement>("[data-search-input]")
  input?.focus()
  input?.select()
}

type Tab = {
  href: string
  Icon: FC<TabIconProps>
  label: string
  active: boolean
  onRetap?: () => void
}

const scrollContentToTop = () => {
  document.querySelector("main")?.scrollTo({ top: 0, behavior: "smooth" })
  document.querySelector("[data-scroll-area]")?.scrollTo({ top: 0, behavior: "smooth" })
}

export const MobileTabBar: FC = () => {
  const [pathname] = useLocation()
  const currentLibraryId = useCurrentLibraryId()
  const libraries = useLibraries().data ?? []
  const [retapCount, setRetapCount] = useState(0)

  const libraryId = currentLibraryId ?? libraries[0]?.id
  const home = libraryId ? `/libraries/${libraryId}` : "/libraries"

  const tabs: Tab[] = [
    { href: home, Icon: HomeTabIcon, label: "Home", active: pathname === home },
    {
      href: libraryId ? `${home}/books` : "/libraries",
      Icon: BrowseTabIcon,
      label: "Browse",
      active: pathname.startsWith("/libraries/") && pathname !== home,
    },
    {
      href: "/search",
      Icon: SearchTabIcon,
      label: "Search",
      active: pathname.startsWith("/search"),
      onRetap: focusSearchInput,
    },
    {
      href: "/you",
      Icon: YouTabIcon,
      label: "You",
      active: ["/you", "/settings", "/account"].some(path => pathname.startsWith(path)),
    },
  ]

  return (
    <nav className="flex h-14 [touch-action:manipulation] items-stretch select-none [-webkit-tap-highlight-color:transparent] md:hidden">
      {tabs.map(({ href, Icon, label, active, onRetap }) => (
        <Link
          key={label}
          href={href}
          aria-current={active ? "page" : undefined}
          onClick={() => {
            if (!active) return
            scrollContentToTop()
            onRetap?.()
            setRetapCount(count => count + 1)
          }}
          className={cn(
            "focus-visible:ring-ring/50 flex flex-1 flex-col items-center justify-center gap-1 rounded-md text-[10px] font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-3",
            active ? "text-primary" : "text-muted-foreground"
          )}
        >
          <Icon active={active} retap={retapCount} className="size-6" />
          {label}
        </Link>
      ))}
    </nav>
  )
}
