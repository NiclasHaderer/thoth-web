import { Order, UUID } from "@/client"
import { PreviewSkeleton } from "@/components/generic/preview-skeleton.tsx"
import { ResourceGrid } from "@/components/resource-grid.tsx"
import { ResourceListHeader } from "@/components/resource-list-header.tsx"
import { RESPONSIVE_GRID } from "@/components/responsive-grid.tsx"
import { SeriesPreview } from "@/components/series/series-preview.tsx"
import { useSeriesList } from "@/queries/resources.ts"
import { pluralize } from "@/utils/utils.ts"
import { useState } from "react"

export const SeriesListOutlet = ({ libraryId }: { libraryId: UUID }) => {
  const [order, setOrder] = useState<Order>("ASC")
  const series = useSeriesList(libraryId, order)

  return (
    <>
      <ResourceListHeader
        title="Series"
        subtitle={pluralize(series.total, "series", "series")}
        order={order}
        onOrderChange={setOrder}
      />
      <ResourceGrid
        key={order}
        listKey={series.listKey}
        total={series.total}
        itemAt={series.itemAt}
        loading={series.loading}
        onRangeChange={series.onRangeChange}
        listClassName={RESPONSIVE_GRID}
        renderItem={item => <SeriesPreview {...item} />}
        renderSkeleton={() => <PreviewSkeleton />}
      />
    </>
  )
}
