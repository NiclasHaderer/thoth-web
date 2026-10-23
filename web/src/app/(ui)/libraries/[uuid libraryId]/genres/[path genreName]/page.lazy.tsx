import { UUID } from "@/client"
import { NameBooks } from "@/components/name-books.tsx"

export const GenreOutlet = ({ libraryId, genreName }: { libraryId: UUID; genreName: string }) => (
  <NameBooks resource="genres" libraryId={libraryId} name={decodeURIComponent(genreName)} />
)
