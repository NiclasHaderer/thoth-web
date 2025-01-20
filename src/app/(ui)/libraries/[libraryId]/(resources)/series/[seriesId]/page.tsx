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
  const fetchSeries = useAudiobookState(s => s.fetchSeriesDetails)
  const series = useAudiobookState(AudiobookSelectors.selectSeries(libraryId, seriesId))
  useEffect(() => {
    void fetchSeries({ libraryId, id: seriesId })
  })
  return series && <SeriesDisplay {...series} />
}
