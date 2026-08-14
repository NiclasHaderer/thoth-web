import { FC } from "react"
import { Link } from "wouter"
import { UUID } from "@thoth/client"
import { Logo } from "@thoth/components/icons/logo"
import { LibraryPicker } from "@thoth/components/menu/library-picker"
import { ResourceChips } from "@thoth/components/menu/resource-chips"
import { cn } from "@thoth/lib/utils"
import { useLibrary } from "@thoth/queries/libraries"

export const LibraryScreenHeader: FC<{ libraryId: UUID; className?: string }> = ({ libraryId, className }) => {
  const library = useLibrary(libraryId)

  return (
    <div className={cn("bg-background/75 sticky top-0 z-10 -mx-5 px-5 pt-4 pb-4 backdrop-blur-xl", className)}>
      <div className="flex items-center gap-2">
        <Link href={`/libraries/${libraryId}`} aria-label="Library home" className="shrink-0 outline-none">
          <Logo className="h-8 w-auto" />
        </Link>
        <LibraryPicker libraryId={libraryId} name={library?.name ?? "Library"} className="grow" />
      </div>

      <ResourceChips libraryId={libraryId} className="-mx-5 mt-3 px-5 pb-0" />
    </div>
  )
}
