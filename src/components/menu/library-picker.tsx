import { CheckIcon, LibraryIcon, SettingsIcon } from "lucide-react"
import { FC, useState } from "react"
import { Button } from "react-aria-components"
import { UUID } from "@thoth/client"
import { LibraryAvatar } from "@thoth/components/library/library-avatar"
import { Link } from "@thoth/components/link.tsx"
import { Sheet, SheetHeader, SheetTitle, SheetTrigger } from "@thoth/components/ui/sheet"
import { useSwipeDismiss } from "@thoth/hooks/swipe-dismiss"
import { rowInteraction } from "@thoth/lib/interactive"
import { cn } from "@thoth/lib/utils"
import { useCurrentUser } from "@thoth/queries/current-user"
import { useLibraries } from "@thoth/queries/libraries"
import { pluralize } from "@thoth/utils/utils"

export const LibraryPicker: FC<{ libraryId: UUID; name: string; className?: string }> = ({
  libraryId,
  name,
  className,
}) => {
  const libraries = useLibraries().data ?? []
  const isAdmin = useCurrentUser().data?.permissions.isAdmin ?? false
  const [isOpen, setIsOpen] = useState(false)
  const swipeRef = useSwipeDismiss(() => setIsOpen(false))

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
        <div aria-hidden ref={swipeRef} className="flex shrink-0 justify-center pt-2.5">
          <span className="bg-muted-foreground/40 h-1 w-10 rounded-full" />
        </div>
        <SheetHeader className="pt-3 pb-3">
          <SheetTitle>Libraries</SheetTitle>
        </SheetHeader>
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
      </Sheet>
    </SheetTrigger>
  )
}
