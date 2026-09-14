import { UUID } from "@/client"
import { NameBooks } from "@/components/name-books.tsx"

export const NarratorOutlet = ({ libraryId, narratorName }: { libraryId: UUID; narratorName: string }) => (
  <NameBooks resource="narrators" libraryId={libraryId} name={decodeURIComponent(narratorName)} />
)
