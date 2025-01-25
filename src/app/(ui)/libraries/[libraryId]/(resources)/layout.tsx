import React from "react"
import { LibraryResourceView } from "@thoth/components/library-resource-view"

export const LibraryLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <LibraryResourceView>{children}</LibraryResourceView>
    </>
  )
}
