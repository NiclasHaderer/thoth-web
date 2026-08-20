import { Api, UUID, unwrap } from "@/client"
import { NameBooks } from "@/components/name-books.tsx"
import { queryKeys } from "@/queries/keys.ts"
import { useQuery } from "@tanstack/react-query"

export const NarratorOutlet = ({ libraryId, narratorName }: { libraryId: UUID; narratorName: string }) => {
  const name = decodeURIComponent(narratorName)
  const { data } = useQuery({
    queryKey: queryKeys.nameDetail("narrators", libraryId, name),
    queryFn: () => unwrap(Api.getNarrator({ libraryId, name: encodeURIComponent(name) })),
    meta: { action: "load the narrator" },
  })

  if (!data) return null

  return <NameBooks name={data.name} books={data.books} />
}
