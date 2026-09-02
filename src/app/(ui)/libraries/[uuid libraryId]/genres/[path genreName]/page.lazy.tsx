import { UUID } from "@/client"
import { NameBooks } from "@/components/name-books.tsx"
import { useGenre } from "@/queries/resources"

export const GenreOutlet = ({ libraryId, genreName }: { libraryId: UUID; genreName: string }) => {
  const { data } = useGenre(libraryId, decodeURIComponent(genreName))

  if (!data) return null

  return <NameBooks name={data.name} books={data.books} />
}
