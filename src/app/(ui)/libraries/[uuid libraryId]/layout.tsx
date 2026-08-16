import { UUID } from "@/client"
import { LibraryResourceView } from "@/components/library-resource-view.tsx"
import { LibraryScreenHeader } from "@/components/menu/library-screen-header.tsx"
import { FC, ReactNode } from "react"

export const LibraryLayout: FC<{ children: ReactNode; libraryId: UUID }> = ({ children, libraryId }) => {
  return (
    <LibraryResourceView libraryId={libraryId}>
      <LibraryScreenHeader libraryId={libraryId} className="md:hidden" />
      {children}
    </LibraryResourceView>
  )
}
