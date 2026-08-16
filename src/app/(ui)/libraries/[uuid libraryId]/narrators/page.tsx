import { Api, UUID } from "@/client"
import { NameList } from "@/components/name-list.tsx"

export const NarratorListOutlet = ({ libraryId }: { libraryId: UUID }) => {
  return (
    <NameList
      libraryId={libraryId}
      resource="narrators"
      title="Narrators"
      unit="narrator"
      basePath={`/libraries/${libraryId}/narrators`}
      list={Api.listNarrators}
    />
  )
}
