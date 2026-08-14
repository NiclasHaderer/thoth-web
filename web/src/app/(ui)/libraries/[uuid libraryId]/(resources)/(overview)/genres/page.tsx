import { Api, UUID } from "@thoth/client"
import { NameList } from "@thoth/components/name-list"

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
