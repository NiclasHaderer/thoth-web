import { FC, useRef, useState } from "react"
import { Order, UUID } from "@thoth/client"
import { ClearIfNotVisible } from "@thoth/components/clear-if-not-visible.tsx"
import { ResourceListHeader } from "@thoth/components/resource-list-header"
import { ResponsiveGrid } from "@thoth/components/responsive-grid"
import { SeriesPreview } from "@thoth/components/series/series-preview.tsx"
import { useInfinityScroll } from "@thoth/hooks/infinity-scroll"
import { useScrollTo } from "@thoth/hooks/scroll-to-top"
import { useSeriesList } from "@thoth/queries/resources"
import { pluralize } from "@thoth/utils/utils"

const SeriesGrid: FC<{ libraryId: UUID; order: Order }> = ({ libraryId, order }) => {
  const loading = useRef<HTMLDivElement>(null)
  useScrollTo("main")
  const { items: seriesList, fetchNextPage, hasNextPage, isFetchingNextPage } = useSeriesList(libraryId, order)
  useInfinityScroll(loading, fetchNextPage, hasNextPage && !isFetchingNextPage)

  return (
    <ResponsiveGrid>
      {seriesList.map((series, k) => (
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
  const { total } = useSeriesList(libraryId, order)

  return (
    <>
      <ResourceListHeader
        title="Series"
        subtitle={pluralize(total, "series", "series")}
        order={order}
        onOrderChange={setOrder}
      />
      <SeriesGrid key={order} libraryId={libraryId} order={order} />
    </>
  )
}
