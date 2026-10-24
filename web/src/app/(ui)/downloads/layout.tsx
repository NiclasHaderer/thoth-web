import { FC, ReactNode } from "react"
import { LibraryResourceView } from "@dewey/components/library-resource-view.tsx"
import { useActiveLibraryId } from "@dewey/hooks/use-current-library"

export const DownloadsLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const libraryId = useActiveLibraryId()
  return <LibraryResourceView libraryId={libraryId}>{children}</LibraryResourceView>
}
