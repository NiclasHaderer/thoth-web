import { Order, UUID } from "@/client"
import { BookPreview } from "@/components/book/book-preview.tsx"
import { PreviewSkeleton } from "@/components/generic/preview-skeleton.tsx"
import { ResourceGrid } from "@/components/resource-grid.tsx"
import { ResourceListHeader } from "@/components/resource-list-header.tsx"
import { RESPONSIVE_GRID } from "@/components/responsive-grid.tsx"
import { useBooks } from "@/queries/resources.ts"
import { pluralize } from "@/utils/utils.ts"
import { useState } from "react"

export const BookListOutlet = ({ libraryId }: { libraryId: UUID }) => {
  const [order, setOrder] = useState<Order>("ASC")
  const books = useBooks(libraryId, order)

  return (
    <>
      <ResourceListHeader
        title="Books"
        subtitle={pluralize(books.total, "book")}
        order={order}
        onOrderChange={setOrder}
      />
      <ResourceGrid
        key={order}
        listKey={books.listKey}
        total={books.total}
        itemAt={books.itemAt}
        loading={books.loading}
        onRangeChange={books.onRangeChange}
        listClassName={RESPONSIVE_GRID}
        renderItem={book => <BookPreview {...book} />}
        renderPlaceholder={() => <PreviewSkeleton subtitle />}
      />
    </>
  )
}
