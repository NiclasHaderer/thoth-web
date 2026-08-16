import { FC } from "react"
import { useLocation } from "wouter"
import { UUID } from "@thoth/client"
import { Logo } from "@thoth/components/icons/logo"
import { libraryDestinations } from "@thoth/components/menu/library-nav"
import { LibraryPicker } from "@thoth/components/menu/library-picker"
import { ResourceChips } from "@thoth/components/menu/resource-chips"
import { cn } from "@thoth/lib/utils"
import { useLibrary } from "@thoth/queries/libraries"

export const LibraryScreenHeader: FC<{ libraryId: UUID; className?: string }> = ({ libraryId, className }) => {
  const library = useLibrary(libraryId)
  const [pathname] = useLocation()
  const browsing = libraryDestinations(libraryId).some(destination => destination.href === pathname)
  const name = library?.name ?? "Library"

  return (
    <div className={cn("bg-background/75 sticky top-0 z-10 -mx-5 px-5 pt-4 pb-4 backdrop-blur-xl", className)}>
      <div className="flex items-center gap-3.5">
        <Logo className="h-8 w-auto shrink-0" />
        <LibraryPicker libraryId={libraryId} name={name} className="grow" />
      </div>

      {browsing ? <ResourceChips libraryId={libraryId} className="-mx-5 mt-3 px-5 pb-0" /> : null}
    </div>
  )
}
