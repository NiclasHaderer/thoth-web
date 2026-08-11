import { FC, useRef, useState } from "react"
import { Order, UUID } from "@thoth/client"
import { ClearIfNotVisible } from "@thoth/components/clear-if-not-visible.tsx"
import { ResourceListHeader } from "@thoth/components/resource-list-header"
import { ResponsiveGrid } from "@thoth/components/responsive-grid"
import { SeriesPreview } from "@thoth/components/series/series-preview.tsx"
import { useInfinityScroll } from "@thoth/hooks/infinity-scroll"
import { useScrollTo } from "@thoth/hooks/scroll-to-top"
import { AudiobookSelectors } from "@thoth/state/audiobook.selectors"
import { useAudiobookState } from "@thoth/state/audiobook.state"

const SeriesGrid: FC<{ libraryId: UUID; order: Order }> = ({ libraryId, order }) => {
  const getSeries = useAudiobookState(s => s.fetchSeries)
  const loading = useRef<HTMLDivElement>(null)
  useScrollTo("main")
  useInfinityScroll(loading, offset => getSeries({ libraryId, offset, order }))
  const series = useAudiobookState(AudiobookSelectors.selectSeriesList(libraryId))

  return (
    <ResponsiveGrid>
      {series.map((series, k) => (
        <ClearIfNotVisible key={k} component={SeriesPreview} childProps={series} />
      ))}
      <div className="col-span-full text-center opacity-0" ref={loading}>
        Loading ...
      </div>
    </ResponsiveGrid>
  )
}

export const SeriesListOutlet = ({ libraryId }: { libraryId: UUID }) => {
  const [order, setOrder] = useState<Order>("ASC")
  const clearSeries = useAudiobookState(s => s.clearSeries)
  const seriesCount = useAudiobookState(AudiobookSelectors.selectSeriesCount(libraryId))

  return (
    <>
      <ResourceListHeader
        title={`${seriesCount} Series`}
        order={order}
        onOrderChange={next => {
          clearSeries(libraryId)
          setOrder(next)
        }}
      />
      <SeriesGrid key={order} libraryId={libraryId} order={order} />
    </>
  )
}
