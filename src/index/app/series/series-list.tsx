import React, { useRef } from "react"
import { useInfinityScroll } from "../../hooks/infinity-scroll"
import { useScrollTo } from "../../hooks/scroll-to-top"
import { AudiobookSelectors } from "../../state/audiobook.selectors"
import { useAudiobookState } from "../../state/audiobook.state"
import { CleanIfNotVisible } from "../common/clean-if-not-visible"
import { ResponsiveGrid } from "../common/responsive-grid"
import { Series } from "./series"

export const SeriesList: React.VFC = () => {
  const getSeries = useAudiobookState(AudiobookSelectors.fetchSeries)
  const series = useAudiobookState(AudiobookSelectors.selectSeriesList)
  const seriesCount = useAudiobookState(AudiobookSelectors.selectSeriesCount)
  const loading = useRef<HTMLDivElement>(null)
  useScrollTo("main")
  useInfinityScroll(loading.current, getSeries)

  return (
    <>
      {seriesCount != null ? <h2 className="p-2 pb-6 text-2xl">{seriesCount} Series</h2> : null}

      <ResponsiveGrid>
        {series.map((series, k) => (
          <CleanIfNotVisible key={k}>
            <Series {...series} />
          </CleanIfNotVisible>
        ))}
        <div className="min-w-full text-center opacity-0" ref={loading}>
          Loading ...
        </div>
      </ResponsiveGrid>
    </>
  )
}
export default SeriesList
