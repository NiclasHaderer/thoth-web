import { UUID } from "@/client"
import { LibraryResourceView } from "@/components/library-resource-view.tsx"
import { LibraryScreenHeader } from "@/components/menu/library-screen-header.tsx"
import { setLastLibraryId } from "@/state/last-library"
import { FC, ReactNode, useEffect } from "react"

export const LibraryLayout: FC<{ children: ReactNode; libraryId: UUID }> = ({ children, libraryId }) => {
  useEffect(() => {
    setLastLibraryId(libraryId)
  }, [libraryId])

  return (
    <LibraryResourceView libraryId={libraryId}>
      <LibraryScreenHeader libraryId={libraryId} className="md:hidden" />
      {children}
    </LibraryResourceView>
  )
}
