import { FC, ReactNode } from "react"
import { LibraryResourceView } from "@thoth/components/library-resource-view.tsx"
import { useActiveLibraryId } from "@thoth/hooks/use-current-library"

export const DownloadsLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const libraryId = useActiveLibraryId()
  return <LibraryResourceView libraryId={libraryId}>{children}</LibraryResourceView>
}
