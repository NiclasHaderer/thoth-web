import { Api, UUID } from "@thoth/client"
import { NameBooks } from "@thoth/components/name-books"
import { useHttpRequest } from "@thoth/hooks/async-response"
import { useOnMount } from "@thoth/hooks/lifecycle"

export const GenreOutlet = ({ libraryId, genreName }: { libraryId: UUID; genreName: string }) => {
  const { result, invoke } = useHttpRequest(Api.getGenre)
  const name = decodeURIComponent(genreName)

  useOnMount(() => void invoke({ libraryId, name: encodeURIComponent(name) }))

  if (!result) return null

  return <NameBooks name={result.name} books={result.books} />
}
