import { UUID } from "@/client"
import { LibraryPreview } from "@/components/library/library-preview"

export const LibraryHomeOutlet = ({ libraryId }: { libraryId: UUID }) => {
  return <LibraryPreview libraryId={libraryId} />
}
