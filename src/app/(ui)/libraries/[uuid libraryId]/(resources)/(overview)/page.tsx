import { UUID } from "@thoth/client"
import { LibraryPreview } from "@thoth/components/library/library-preview"

export const LibraryHomeOutlet = ({ libraryId }: { libraryId: UUID }) => {
  return <LibraryPreview libraryId={libraryId} />
}
