import { FC, ReactNode } from "react"
import { UUID } from "@thoth/client"
import { LibraryResourceView } from "@thoth/components/library-resource-view"

export const LibraryLayout: FC<{ children: ReactNode; libraryId: UUID }> = ({ children, libraryId }) => {
  return <LibraryResourceView libraryId={libraryId}>{children}</LibraryResourceView>
}
