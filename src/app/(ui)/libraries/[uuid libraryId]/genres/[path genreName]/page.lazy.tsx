import { Api, UUID, unwrap } from "@/client"
import { NameBooks } from "@/components/name-books.tsx"
import { queryKeys } from "@/queries/keys.ts"
import { useQuery } from "@tanstack/react-query"
import { TagsIcon } from "lucide-react"

export const GenreOutlet = ({ libraryId, genreName }: { libraryId: UUID; genreName: string }) => {
  const name = decodeURIComponent(genreName)
  const { data } = useQuery({
    queryKey: queryKeys.nameDetail("genres", libraryId, name),
    queryFn: () => unwrap(Api.getGenre({ libraryId, name: encodeURIComponent(name) })),
    meta: { action: "load the genre" },
  })

  if (!data) return null

  return <NameBooks name={data.name} books={data.books} icon={TagsIcon} />
}
