import { ChevronDownIcon, LibraryIcon, PanelLeftCloseIcon, PanelLeftOpenIcon } from "lucide-react"
import { FC, useState } from "react"
import { Button, MenuTrigger } from "react-aria-components"
import { UUID } from "@thoth/client"
import { useLibraryDestinations } from "@thoth/components/menu/library-nav"
import { NavItem } from "@thoth/components/menu/nav-item"
import { DropdownMenu, DropdownMenuItem } from "@thoth/components/ui/dropdown-menu"
import { cn } from "@thoth/lib/utils"
import { AudiobookSelectors } from "@thoth/state/audiobook.selectors"
import { useAudiobookState } from "@thoth/state/audiobook.state"

const COLLAPSED_KEY = "library-menu-collapsed"

export const LeftResourceMenu: FC<{ libraryId: UUID; className?: string }> = ({ libraryId, className }) => {
  const libraries = useAudiobookState(AudiobookSelectors.libraries)
  const library = useAudiobookState(state => state.libraryMap[libraryId])
  const destinations = useLibraryDestinations(libraryId)

  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(COLLAPSED_KEY) === "true")

  const toggleCollapsed = () => {
    setCollapsed(previous => {
      localStorage.setItem(COLLAPSED_KEY, String(!previous))
      return !previous
    })
  }

  const libraryName = library?.name ?? "Library"
  const ToggleIcon = collapsed ? PanelLeftOpenIcon : PanelLeftCloseIcon

  return (
    <aside
      className={cn(
        "bg-card my-3 ml-3 flex shrink-0 flex-col overflow-hidden rounded-xl p-2 transition-[width] duration-200",
        collapsed ? "w-16" : "w-56",
        className
      )}
    >
      {libraries.length > 1 ? (
        <MenuTrigger>
          <Button
            aria-label={collapsed ? libraryName : undefined}
            className={cn(
              "group hover:bg-muted focus-visible:bg-muted flex h-12 w-full cursor-pointer items-center rounded-lg text-left transition-colors outline-none",
              collapsed ? "justify-center px-0" : "gap-3 px-3"
            )}
          >
            <LibraryIcon className="text-muted-foreground size-4 shrink-0" />
            {collapsed ? null : (
              <>
                <span className="truncate text-sm font-medium">{libraryName}</span>
                <ChevronDownIcon className="text-muted-foreground ml-auto size-4 shrink-0 transition-transform duration-200 group-aria-expanded:rotate-180" />
              </>
            )}
          </Button>
          <DropdownMenu placement="bottom start" className="w-56">
            {libraries.map(entry => (
              <DropdownMenuItem key={entry.id} className="gap-2.5 px-2.5 py-2 text-sm" href={`/libraries/${entry.id}`}>
                <LibraryIcon className="size-4" />
                {entry.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenu>
        </MenuTrigger>
      ) : (
        <div className={cn("flex h-12 items-center", collapsed ? "justify-center" : "gap-3 px-3")}>
          <LibraryIcon className="text-muted-foreground size-4 shrink-0" />
          {collapsed ? null : <span className="truncate text-sm font-medium">{libraryName}</span>}
        </div>
      )}

      <ul className="mt-2 flex flex-col gap-1">
        {destinations.map(destination => (
          <li key={destination.href}>
            <NavItem {...destination} collapsed={collapsed} />
          </li>
        ))}
      </ul>

      <Button
        aria-label={collapsed ? "Expand menu" : "Collapse menu"}
        onPress={toggleCollapsed}
        className={cn(
          "text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:bg-muted mt-auto flex size-10 cursor-pointer items-center justify-center rounded-lg transition-colors outline-none",
          collapsed ? "mx-auto" : "ml-auto"
        )}
      >
        <ToggleIcon className="size-4 shrink-0" />
      </Button>
    </aside>
  )
}
