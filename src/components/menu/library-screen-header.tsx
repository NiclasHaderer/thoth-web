import { motion, useMotionValue } from "motion/react"
import { FC, useEffect } from "react"
import { useLocation } from "wouter"
import { UUID } from "@thoth/client"
import { Logo } from "@thoth/components/icons/logo"
import { libraryDestinations } from "@thoth/components/menu/library-nav"
import { LibraryPicker } from "@thoth/components/menu/library-picker"
import { ResourceChips } from "@thoth/components/menu/resource-chips"
import { useScrollSurface } from "@thoth/components/scroll-surface"
import { cn } from "@thoth/lib/utils"
import { useLibrary } from "@thoth/queries/libraries"

const FADE_DISTANCE = 160

export const LibraryScreenHeader: FC<{ libraryId: UUID; className?: string }> = ({ libraryId, className }) => {
  const library = useLibrary(libraryId)
  const [pathname] = useLocation()
  const surface = useScrollSurface()
  const veil = useMotionValue(0)
  const browsing = libraryDestinations(libraryId).some(destination => destination.href === pathname)
  const name = library?.name ?? "Library"

  useEffect(() => {
    if (!surface) return
    const onScroll = () => veil.set(Math.min(1, Math.max(0, surface.scrollTop / FADE_DISTANCE)))
    onScroll()
    surface.addEventListener("scroll", onScroll, { passive: true })
    return () => surface.removeEventListener("scroll", onScroll)
  }, [surface, veil])

  return (
    <div className={cn("sticky top-0 z-10 -mx-5 px-5 pt-4 pb-4 backdrop-blur-xl", className)}>
      <motion.div aria-hidden style={{ opacity: veil }} className="bg-background/75 absolute inset-0" />

      <div className="relative flex items-center gap-3.5">
        <Logo className="h-8 w-auto shrink-0" />
        <LibraryPicker libraryId={libraryId} name={name} className="grow" />
      </div>

      {browsing ? <ResourceChips libraryId={libraryId} className="relative -mx-5 mt-3 px-5 pb-0" /> : null}
    </div>
  )
}
