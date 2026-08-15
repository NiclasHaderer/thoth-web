import { useQuery } from "@tanstack/react-query"
import { Api, UUID, unwrap } from "@thoth/client"
import { NameBooks } from "@thoth/components/name-books"
import { queryKeys } from "@thoth/queries/keys"

export const GenreOutlet = ({ libraryId, genreName }: { libraryId: UUID; genreName: string }) => {
  const name = decodeURIComponent(genreName)
  const { data } = useQuery({
    queryKey: queryKeys.nameDetail("genres", libraryId, name),
    queryFn: () => unwrap(Api.getGenre({ libraryId, name: encodeURIComponent(name) })),
    meta: { action: "load the genre" },
  })

  if (!data) return null

  return <NameBooks name={data.name} books={data.books} />
}
