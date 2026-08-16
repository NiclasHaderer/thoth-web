import { Order, UUID } from "@/client"
import { ClearIfNotVisible } from "@/components/clear-if-not-visible.tsx"
import { ResourceListHeader } from "@/components/resource-list-header.tsx"
import { ResponsiveGrid } from "@/components/responsive-grid.tsx"
import { SeriesPreview } from "@/components/series/series-preview.tsx"
import { useInfinityScroll } from "@/hooks/infinity-scroll.ts"
import { useScrollTo } from "@/hooks/scroll-to-top.ts"
import { useSeriesList } from "@/queries/resources.ts"
import { pluralize } from "@/utils/utils.ts"
import { FC, useRef, useState } from "react"

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
