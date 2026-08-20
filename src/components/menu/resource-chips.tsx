import { motion } from "motion/react"
import { FC } from "react"
import { useLocation } from "wouter"
import { UUID } from "@thoth/client"
import { Link } from "@thoth/components/link.tsx"
import { libraryDestinations } from "@thoth/components/menu/library-nav"
import { cn } from "@thoth/lib/utils"

export const ResourceChips: FC<{ libraryId: UUID; className?: string }> = ({ libraryId, className }) => {
  const [pathname] = useLocation()
  const destinations = libraryDestinations(libraryId).filter(destination => !destination.exact)

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
              "focus-visible:ring-ring/50 relative shrink-0 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-[color,background-color,scale] outline-none [corner-shape:squircle] focus-visible:ring-3 active:scale-[0.98] active:duration-75",
              active
                ? "text-foreground"
                : "bg-muted text-muted-foreground no-touch:hover:bg-accent no-touch:hover:text-foreground"
            )}
          >
            {active ? (
              <motion.span
                layoutId="resource-chip"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="bg-primary/18 absolute inset-0 rounded-lg [corner-shape:squircle]"
              />
            ) : null}
            <span className="relative">{label}</span>
          </Link>
        )
      })}
    </div>
  )
}
