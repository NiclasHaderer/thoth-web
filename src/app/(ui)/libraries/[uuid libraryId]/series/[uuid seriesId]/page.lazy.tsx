import { UUID } from "@/client"
import SeriesDetails from "@/components/series/series-details.tsx"

export const SeriesOutlet = ({ libraryId, seriesId }: { libraryId: UUID; seriesId: UUID }) => {
  return <SeriesDetails seriesId={seriesId} libraryId={libraryId} />
}
