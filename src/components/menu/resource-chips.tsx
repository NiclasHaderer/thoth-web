import { FC } from "react"
import { Link, useLocation } from "wouter"
import { UUID } from "@thoth/client"
import { useLibraryDestinations } from "@thoth/components/menu/library-nav"
import { cn } from "@thoth/lib/utils"

export const ResourceChips: FC<{ libraryId: UUID; className?: string }> = ({ libraryId, className }) => {
  const [pathname] = useLocation()
  const destinations = useLibraryDestinations(libraryId).filter(destination => !destination.exact)

  return (
    <div className={cn("no-scrollbar flex gap-2 overflow-x-auto px-4 pb-2", className)}>
      {destinations.map(({ href, label }) => {
        const active = pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "focus-visible:ring-ring/50 shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition-colors outline-none focus-visible:ring-3",
              active
                ? "bg-primary text-primary-foreground"
                : "bg-popover text-muted-foreground no-touch:hover:bg-muted no-touch:hover:text-foreground"
            )}
          >
            {label}
          </Link>
        )
      })}
    </div>
  )
}
