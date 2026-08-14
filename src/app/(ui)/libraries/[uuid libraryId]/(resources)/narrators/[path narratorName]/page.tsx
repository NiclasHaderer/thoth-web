import { useQuery } from "@tanstack/react-query"
import { Api, UUID, unwrap } from "@thoth/client"
import { NameBooks } from "@thoth/components/name-books"
import { queryKeys } from "@thoth/queries/keys"

export const NarratorOutlet = ({ libraryId, narratorName }: { libraryId: UUID; narratorName: string }) => {
  const name = decodeURIComponent(narratorName)
  const { data } = useQuery({
    queryKey: queryKeys.nameDetail("narrators", libraryId, name),
    queryFn: () => unwrap(Api.getNarrator({ libraryId, name: encodeURIComponent(name) })),
  })

  if (!data) return null

  return <NameBooks name={data.name} books={data.books} />
}
