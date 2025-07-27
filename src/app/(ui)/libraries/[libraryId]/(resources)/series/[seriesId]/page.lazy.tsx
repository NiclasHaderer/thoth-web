import { UUID } from "@thoth/client"
import SeriesDetails from "@thoth/components/series/series-details.tsx"

export const SeriesOutlet = ({ libraryId, seriesId }: { libraryId: UUID; seriesId: UUID }) => {
  return <SeriesDetails seriesId={seriesId} libraryId={libraryId} />
}
