import { Api, UUID } from "@thoth/client"
import { NameBooks } from "@thoth/components/name-books"
import { useHttpRequest } from "@thoth/hooks/async-response"
import { useOnMount } from "@thoth/hooks/lifecycle"

export const NarratorOutlet = ({ libraryId, narratorName }: { libraryId: UUID; narratorName: string }) => {
  const { result, invoke } = useHttpRequest(Api.getNarrator)
  const name = decodeURIComponent(narratorName)

  useOnMount(() => void invoke({ libraryId, name: encodeURIComponent(name) }))

  if (!result) return null

  return <NameBooks name={result.name} books={result.books} />
}
