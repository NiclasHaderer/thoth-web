import { ChevronDownIcon, LibraryIcon } from "lucide-react"
import { FC } from "react"
import { Button, MenuTrigger } from "react-aria-components"
import { UUID } from "@thoth/client"
import { CollapsibleLabel } from "@thoth/components/menu/collapsible-label"
import { libraryDestinations } from "@thoth/components/menu/library-nav"
import { SideMenu } from "@thoth/components/menu/side-menu"
import { DropdownMenu, DropdownMenuItem } from "@thoth/components/ui/dropdown-menu"
import { cn } from "@thoth/lib/utils"
import { useLibraries, useLibrary } from "@thoth/queries/libraries"

export const LibraryMenu: FC<{ libraryId: UUID; className?: string }> = ({ libraryId, className }) => {
  const libraries = useLibraries().data ?? []
  const library = useLibrary(libraryId)
  const destinations = libraryDestinations(libraryId)

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
                "group hover:bg-muted focus-visible:bg-muted flex h-12 w-full cursor-pointer items-center gap-3 rounded-lg pl-4 text-left transition-[color,background-color,padding] duration-150 outline-none",
                collapsed ? "pr-0" : "pr-3"
              )}
            >
              <LibraryIcon className="text-muted-foreground size-4 shrink-0" />
              <CollapsibleLabel collapsed={collapsed}>
                <span className="truncate text-sm font-medium">{libraryName}</span>
                <ChevronDownIcon className="text-muted-foreground ml-auto size-4 shrink-0 transition-transform duration-200 group-aria-expanded:rotate-180" />
              </CollapsibleLabel>
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
          <div className={cn("flex h-12 items-center gap-3 pl-4", collapsed ? "pr-0" : "pr-3")}>
            <LibraryIcon className="text-muted-foreground size-4 shrink-0" />
            <CollapsibleLabel collapsed={collapsed}>
              <span className="truncate text-sm font-medium">{libraryName}</span>
            </CollapsibleLabel>
          </div>
        )
      }
    />
  )
}
