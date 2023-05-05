"use client"
import { UUID } from "@thoth/client"
import { useAudiobookState } from "@thoth/state/audiobook.state"
import { AudiobookSelectors } from "@thoth/state/audiobook.selectors"
import { useEffect } from "react"
import { SeriesDisplay } from "@thoth/components/series/series"

export default function SeriesOutlet({
  params: { seriesId, libraryId },
}: {
  params: { libraryId: UUID; seriesId: UUID }
}) {
  const fetchSeries = useAudiobookState(AudiobookSelectors.fetchSeriesDetails)
  const series = useAudiobookState(AudiobookSelectors.selectSeries(libraryId, seriesId))
  useEffect(() => {
    fetchSeries(libraryId, seriesId)
  })
  return series && <SeriesDisplay {...series} />
}
