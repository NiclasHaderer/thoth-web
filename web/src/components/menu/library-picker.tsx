import { cn } from "cn"
import { CheckIcon, LibraryIcon, SettingsIcon } from "lucide-react"
import { FC, useState } from "react"
import { Button } from "react-aria-components"
import { UUID } from "@dewey/client"
import { BottomSheet } from "@dewey/components/bottom-sheet"
import { LibraryAvatar } from "@dewey/components/library/library-avatar"
import { Link } from "@dewey/components/link.tsx"
import { SheetTrigger } from "@dewey/components/ui/sheet"
import { rowInteraction } from "@dewey/lib/interaction-styles"
import { useCurrentUser } from "@dewey/queries/current-user-queries"
import { useLibraries } from "@dewey/queries/library-queries"
import { pluralize } from "@dewey/utils/utils"

export const LibraryPicker: FC<{ libraryId: UUID; name: string; className?: string }> = ({
  libraryId,
  name,
  className,
}) => {
  const libraries = useLibraries().data ?? []
  const isAdmin = useCurrentUser().data?.permissions.isAdmin ?? false
  const [isOpen, setIsOpen] = useState(false)

  if (libraries.length <= 1) {
    return (
      <h1 className={cn("min-h-11 min-w-0 truncate pr-2.5 pl-3 text-2xl leading-11 font-bold", className)}>{name}</h1>
    )
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
      <BottomSheet title="Libraries" onDismiss={() => setIsOpen(false)}>
        <div className="flex flex-col gap-1 pb-3">
          {libraries.map(entry => {
            const current = entry.id === libraryId
            return (
              <Link
                key={entry.id}
                href={`/libraries/${entry.id}`}
                onClick={() => setIsOpen(false)}
                aria-current={current ? "true" : undefined}
                className={cn(rowInteraction, "mx-2 flex h-16 items-center gap-4 rounded-lg px-2")}
              >
                <LibraryAvatar name={entry.name} className="size-10 rounded-xl text-sm" />
                <span className="flex min-w-0 grow flex-col gap-0.5">
                  <span className={cn("truncate text-sm", current ? "font-semibold" : "font-medium")}>
                    {entry.name}
                  </span>
                  <span className="text-muted-foreground text-xs tabular-nums">
                    {pluralize(entry.bookCount, "book")}
                  </span>
                </span>
                {current ? <CheckIcon aria-hidden className="text-primary size-5 shrink-0" /> : null}
              </Link>
            )
          })}
          {isAdmin && (
            <>
              <div className="bg-border mx-4 my-2 h-px" />
              <Link
                href="/settings/libraries"
                onClick={() => setIsOpen(false)}
                className={cn(
                  rowInteraction,
                  "text-muted-foreground mx-2 flex h-14 items-center gap-4 rounded-lg px-2"
                )}
              >
                <span className="flex size-10 shrink-0 items-center justify-center">
                  <SettingsIcon aria-hidden className="size-4.5" />
                </span>
                <span className="text-sm font-medium">Manage libraries</span>
              </Link>
            </>
          )}
        </div>
      </BottomSheet>
    </SheetTrigger>
  )
}
