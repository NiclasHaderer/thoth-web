import { FC, ReactNode } from "react"
import { UUID } from "@thoth/client"
import { LibraryScreenHeader } from "@thoth/components/menu/library-screen-header"

export const LibraryOverviewLayout: FC<{ children: ReactNode; libraryId: UUID }> = ({ children, libraryId }) => {
  return (
    <>
      <LibraryScreenHeader libraryId={libraryId} className="md:hidden" />
      {children}
    </>
  )
}
