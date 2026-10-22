import { UUID } from "@/client"
import { LibraryResourceView } from "@/components/library-resource-view.tsx"
import { browseDestinations } from "@/components/menu/library-nav"
import { LibraryScreenHeader } from "@/components/menu/library-screen-header.tsx"
import { useBreakpoint } from "@/hooks/use-media-query"
import { useSwipeNavigation } from "@/hooks/use-swipe-navigation"
import { setLastLibraryId } from "@/state/last-library"
import { motion } from "motion/react"
import { FC, ReactNode, useEffect } from "react"

export const LibraryLayout: FC<{ children: ReactNode; libraryId: UUID }> = ({ children, libraryId }) => {
  const isDesktop = useBreakpoint("md")
  const { setElement, style, clipStyle } = useSwipeNavigation(
    isDesktop ? [] : browseDestinations(libraryId).map(destination => destination.href)
  )

  useEffect(() => {
    setLastLibraryId(libraryId)
  }, [libraryId])

  return (
    <LibraryResourceView libraryId={libraryId}>
      <LibraryScreenHeader libraryId={libraryId} className="md:hidden" />
      <div style={clipStyle} className="-mx-5 flex min-w-0 grow flex-col px-5">
        <motion.div ref={setElement} style={style} className="flex min-w-0 grow flex-col">
          {children}
        </motion.div>
      </div>
    </LibraryResourceView>
  )
}
