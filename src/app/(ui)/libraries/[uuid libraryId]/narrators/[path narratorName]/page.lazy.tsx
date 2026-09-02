import { UUID } from "@/client"
import { NameBooks } from "@/components/name-books.tsx"
import { useNarrator } from "@/queries/resources"

export const NarratorOutlet = ({ libraryId, narratorName }: { libraryId: UUID; narratorName: string }) => {
  const { data } = useNarrator(libraryId, decodeURIComponent(narratorName))

  if (!data) return null

  return <NameBooks name={data.name} books={data.books} />
}
