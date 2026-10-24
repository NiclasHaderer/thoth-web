import { cn } from "cn"
import { motion, useMotionValue } from "motion/react"
import { FC, useEffect } from "react"
import { useLocation } from "wouter"
import { UUID } from "@dewey/client"
import { libraryDestinations } from "@dewey/components/menu/library-nav"
import { LibraryPicker } from "@dewey/components/menu/library-picker"
import { MobileTopBar } from "@dewey/components/menu/mobile-top-bar"
import { ResourceChips } from "@dewey/components/menu/resource-chips"
import { useScrollSurface } from "@dewey/components/scroll-surface"
import { useLibrary } from "@dewey/queries/library-queries"

const FADE_DISTANCE = 160

export const LibraryScreenHeader: FC<{ libraryId: UUID; className?: string }> = ({ libraryId, className }) => {
  const library = useLibrary(libraryId)
  const [pathname] = useLocation()
  const surface = useScrollSurface()
  const veil = useMotionValue(0)
  const browsing = libraryDestinations(libraryId).some(destination => destination.href === pathname)
  const name = library?.name ?? ""

  useEffect(() => {
    if (!surface) return
    const onScroll = () => veil.set(Math.min(1, Math.max(0, surface.scrollTop / FADE_DISTANCE)))
    onScroll()
    surface.addEventListener("scroll", onScroll, { passive: true })
    return () => surface.removeEventListener("scroll", onScroll)
  }, [surface, veil])

  return (
    <MobileTopBar
      className={cn("pb-4", className)}
      backdrop={<motion.div aria-hidden style={{ opacity: veil }} className="bg-background/75 absolute inset-0" />}
      below={browsing ? <ResourceChips libraryId={libraryId} className="relative -mx-5 mt-3 px-5 pb-0" /> : null}
    >
      <LibraryPicker libraryId={libraryId} name={name} className="grow" />
    </MobileTopBar>
  )
}
