"use client"

import React, { use, useRef } from "react"
import { useAudiobookState } from "@thoth/state/audiobook.state"
import { AudiobookSelectors } from "@thoth/state/audiobook.selectors"
import { useScrollTo } from "@thoth/hooks/scroll-to-top"
import { useInfinityScroll } from "@thoth/hooks/infinity-scroll"
import { ResponsiveGrid } from "@thoth/components/responsive-grid"
import { CleanIfNotVisible } from "@thoth/components/clean-if-not-visible"
import { SeriesDisplay } from "@thoth/components/series/series"
import { UUID } from "@thoth/client"

export default function SeriesListOutlet({ params }: { params: Promise<{ libraryId: UUID }> }) {
  const { libraryId } = use(params)
  const getSeries = useAudiobookState(s => s.fetchSeries)
  const loading = useRef<HTMLDivElement>(null)
  useScrollTo("main")
  useInfinityScroll(loading.current, offset => getSeries({ libraryId, offset }))
  const series = useAudiobookState(AudiobookSelectors.selectSeriesList(libraryId))
  const seriesCount = useAudiobookState(AudiobookSelectors.selectSeriesCount(libraryId))

  return (
    <>
      {<h2 className="p-2 pb-6 text-2xl">{seriesCount} Series</h2>}
      <ResponsiveGrid>
        {series.map((series, k) => (
          <CleanIfNotVisible key={k}>
            <SeriesDisplay {...series} />
          </CleanIfNotVisible>
        ))}
        <div className="min-w-full text-center opacity-0" ref={loading}>
          Loading ...
        </div>
      </ResponsiveGrid>
    </>
  )
}
