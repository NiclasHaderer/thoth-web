import { ChevronDownIcon, LibraryIcon } from "lucide-react"
import { FC } from "react"
import { Button, MenuTrigger } from "react-aria-components"
import { UUID } from "@thoth/client"
import { useLibraryDestinations } from "@thoth/components/menu/library-nav"
import { SideMenu } from "@thoth/components/menu/side-menu"
import { DropdownMenu, DropdownMenuItem } from "@thoth/components/ui/dropdown-menu"
import { cn } from "@thoth/lib/utils"
import { AudiobookSelectors } from "@thoth/state/audiobook.selectors"
import { useAudiobookState } from "@thoth/state/audiobook.state"

export const LibraryMenu: FC<{ libraryId: UUID; className?: string }> = ({ libraryId, className }) => {
  const libraries = useAudiobookState(AudiobookSelectors.libraries)
  const library = useAudiobookState(state => state.libraryMap[libraryId])
  const destinations = useLibraryDestinations(libraryId)

  const libraryName = library?.name ?? "Library"

  return (
    <SideMenu
      className={className}
      items={destinations}
      header={collapsed =>
        libraries.length > 1 ? (
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
                <DropdownMenuItem
                  key={entry.id}
                  className="gap-2.5 px-2.5 py-2 text-sm"
                  href={`/libraries/${entry.id}`}
                >
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
        )
      }
    />
  )
}
