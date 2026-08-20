import { useQueryClient } from "@tanstack/react-query"
import { CheckIcon, LibraryIcon } from "lucide-react"
import { FC, useState } from "react"
import { Button } from "react-aria-components"
import { UUID } from "@thoth/client"
import { Link } from "@thoth/components/link.tsx"
import { Sheet, SheetHeader, SheetTitle, SheetTrigger } from "@thoth/components/ui/sheet"
import { rowInteraction } from "@thoth/lib/interactive"
import { cn } from "@thoth/lib/utils"
import { useLibraries } from "@thoth/queries/libraries"
import { cachedResourceTotal } from "@thoth/queries/resources"
import { pluralize } from "@thoth/utils/utils"

export const LibraryPicker: FC<{ libraryId: UUID; name: string; className?: string }> = ({
  libraryId,
  name,
  className,
}) => {
  const libraries = useLibraries().data ?? []
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)

  if (libraries.length <= 1) {
    return <h1 className={cn("min-w-0 truncate px-2 text-2xl font-bold", className)}>{name}</h1>
  }

  return (
    <SheetTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
      <Button
        aria-label={`Current library ${name}, switch library`}
        className={cn(
          rowInteraction,
          "inset-ring-border flex min-h-11 min-w-0 cursor-pointer items-center gap-2 rounded-xl py-1 pr-2.5 pl-3 text-left inset-ring select-none [corner-shape:squircle]",
          className
        )}
      >
        <span className="min-w-0 truncate text-2xl font-bold">{name}</span>
        <LibraryIcon aria-hidden className="text-muted-foreground ml-auto size-5 shrink-0" />
      </Button>
      <Sheet side="bottom" showCloseButton={false} className="gap-0 rounded-t-xl pb-[env(safe-area-inset-bottom)]">
        <SheetHeader className="pb-2">
          <SheetTitle>Libraries</SheetTitle>
        </SheetHeader>
        <div className="pb-2">
          {libraries.map(entry => {
            const bookCount = cachedResourceTotal(queryClient, "books", entry.id)
            const current = entry.id === libraryId
            return (
              <Link
                key={entry.id}
                href={`/libraries/${entry.id}`}
                onClick={() => setIsOpen(false)}
                aria-current={current ? "true" : undefined}
                className={cn(rowInteraction, "mx-2 flex h-14 items-center gap-3 px-2")}
              >
                {current ? (
                  <CheckIcon aria-hidden className="text-primary size-5 shrink-0" />
                ) : (
                  <LibraryIcon aria-hidden className="text-muted-foreground size-5 shrink-0" />
                )}
                <span className={cn("truncate text-sm", current ? "font-semibold" : "font-medium")}>{entry.name}</span>
                <span className="text-muted-foreground ml-auto shrink-0 text-xs tabular-nums">
                  {pluralize(bookCount ?? 0, "book")}
                </span>
              </Link>
            )
          })}
        </div>
      </Sheet>
    </SheetTrigger>
  )
}
