import { LibraryResourceView } from "@thoth/components/library-resource-view"
import { FC, ReactNode } from "react"

export const LibraryLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      <LibraryResourceView>{children}</LibraryResourceView>
    </>
  )
}
