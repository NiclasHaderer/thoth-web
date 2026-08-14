import { Api, UUID } from "@thoth/client"
import { NameList } from "@thoth/components/name-list"

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
