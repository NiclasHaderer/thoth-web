import { Api, UUID } from "@/client"
import { NameList } from "@/components/name-list.tsx"

export const GenreListOutlet = ({ libraryId }: { libraryId: UUID }) => {
  return (
    <NameList
      libraryId={libraryId}
      resource="genres"
      title="Genres"
      unit="genre"
      basePath={`/libraries/${libraryId}/genres`}
      list={Api.listGenres}
    />
  )
}
