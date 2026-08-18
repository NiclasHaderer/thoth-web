import { Order, UUID } from "@/client"
import { AuthorPreview } from "@/components/author/author-preview.tsx"
import { PreviewSkeleton } from "@/components/generic/preview-skeleton.tsx"
import { ResourceGrid } from "@/components/resource-grid.tsx"
import { ResourceListHeader } from "@/components/resource-list-header.tsx"
import { RESPONSIVE_GRID } from "@/components/responsive-grid.tsx"
import { useAuthors } from "@/queries/resources.ts"
import { pluralize } from "@/utils/utils.ts"
import { useState } from "react"

export const AuthorListOutlet = ({ libraryId }: { libraryId: UUID }) => {
  const [order, setOrder] = useState<Order>("ASC")
  const authors = useAuthors(libraryId, order)

  return (
    <>
      <ResourceListHeader
        title="Authors"
        subtitle={pluralize(authors.total, "author")}
        order={order}
        onOrderChange={setOrder}
      />
      <ResourceGrid
        key={order}
        listKey={authors.listKey}
        total={authors.total}
        itemAt={authors.itemAt}
        loading={authors.loading}
        onRangeChange={authors.onRangeChange}
        listClassName={RESPONSIVE_GRID}
        renderItem={author => <AuthorPreview {...author} />}
        renderPlaceholder={() => <PreviewSkeleton round />}
      />
    </>
  )
}
