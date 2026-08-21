import { CheckIcon, ChevronDownIcon, LibraryIcon, SettingsIcon } from "lucide-react"
import { FC } from "react"
import { Button, MenuTrigger } from "react-aria-components"
import { UUID } from "@thoth/client"
import { LibraryAvatar } from "@thoth/components/library/library-avatar"
import { CollapsibleLabel } from "@thoth/components/menu/collapsible-label"
import { libraryDestinations } from "@thoth/components/menu/library-nav"
import { SideMenu } from "@thoth/components/menu/side-menu"
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@thoth/components/ui/dropdown-menu"
import { cn } from "@thoth/lib/utils"
import { useCurrentUser } from "@thoth/queries/current-user"
import { useLibraries, useLibrary } from "@thoth/queries/libraries"
import { pluralize } from "@thoth/utils/utils"

export const LibraryMenu: FC<{ libraryId: UUID; className?: string }> = ({ libraryId, className }) => {
  const libraries = useLibraries().data ?? []
  const library = useLibrary(libraryId)
  const isAdmin = useCurrentUser().data?.permissions.isAdmin ?? false
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
            <DropdownMenu placement="bottom start" className="w-60">
              <DropdownMenuLabel>Libraries</DropdownMenuLabel>
              {libraries.map(entry => {
                const current = entry.id === libraryId
                return (
                  <DropdownMenuItem
                    key={entry.id}
                    href={`/libraries/${entry.id}`}
                    textValue={entry.name}
                    className="gap-2.5 rounded-lg px-2 py-1.5"
                  >
                    <LibraryAvatar name={entry.name} />
                    <span className="flex min-w-0 grow flex-col">
                      <span className={cn("truncate text-sm", current ? "font-semibold" : "font-medium")}>
                        {entry.name}
                      </span>
                      <span className="text-muted-foreground text-xs tabular-nums">
                        {pluralize(entry.bookCount, "book")}
                      </span>
                    </span>
                    {current ? <CheckIcon className="text-primary ml-auto size-4 shrink-0" /> : null}
                  </DropdownMenuItem>
                )
              })}
              {isAdmin && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    href="/settings/libraries"
                    textValue="Manage libraries"
                    className="text-muted-foreground gap-2.5 rounded-lg px-2 py-1.5"
                  >
                    <span className="flex size-7 shrink-0 items-center justify-center">
                      <SettingsIcon className="size-4" />
                    </span>
                    <span className="text-sm font-medium">Manage libraries</span>
                  </DropdownMenuItem>
                </>
              )}
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
