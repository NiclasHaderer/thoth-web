import React, { useRef } from "react"
import { useInfinityScroll } from "../../Hooks/InfinityScroll"
import { useScrollTo } from "../../Hooks/ScrollToTop"
import { AudiobookSelectors } from "../../State/Audiobook.Selectors"
import { useAudiobookState } from "../../State/Audiobook.State"
import { ResponsiveGrid } from "../Common/ResponsiveGrid"
import { Series } from "./Series"

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
          <Series {...series} key={k} />
        ))}
        <div className="min-w-full text-center opacity-0" ref={loading}>
          Loading ...
        </div>
      </ResponsiveGrid>
    </>
  )
}
export default SeriesList
