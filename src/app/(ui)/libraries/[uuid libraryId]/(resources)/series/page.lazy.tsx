import { useRef } from "react"
import { UUID } from "@thoth/client"
import { ClearIfNotVisible } from "@thoth/components/clear-if-not-visible.tsx"
import { ResponsiveGrid } from "@thoth/components/responsive-grid"
import { SeriesPreview } from "@thoth/components/series/series-preview.tsx"
import { useInfinityScroll } from "@thoth/hooks/infinity-scroll"
import { useScrollTo } from "@thoth/hooks/scroll-to-top"
import { AudiobookSelectors } from "@thoth/state/audiobook.selectors"
import { useAudiobookState } from "@thoth/state/audiobook.state"

export const SeriesListOutlet = ({ libraryId }: { libraryId: UUID }) => {
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
          <ClearIfNotVisible key={k} component={SeriesPreview} childProps={series} />
        ))}
        <div className="min-w-full text-center opacity-0" ref={loading}>
          Loading ...
        </div>
      </ResponsiveGrid>
    </>
  )
}
