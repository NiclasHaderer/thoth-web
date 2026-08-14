import { FC, useRef, useState } from "react"
import { Order, UUID } from "@thoth/client"
import { BookPreview } from "@thoth/components/book/book-preview.tsx"
import { ClearIfNotVisible } from "@thoth/components/clear-if-not-visible.tsx"
import { ResourceListHeader } from "@thoth/components/resource-list-header"
import { ResponsiveGrid } from "@thoth/components/responsive-grid"
import { useInfinityScroll } from "@thoth/hooks/infinity-scroll"
import { useScrollTo } from "@thoth/hooks/scroll-to-top"
import { useBooks } from "@thoth/queries/resources"
import { pluralize } from "@thoth/utils/utils"

const BookGrid: FC<{ libraryId: UUID; order: Order }> = ({ libraryId, order }) => {
  const loading = useRef<HTMLDivElement>(null)
  useScrollTo("main")
  const { items: books, fetchNextPage, hasNextPage, isFetchingNextPage } = useBooks(libraryId, order)
  useInfinityScroll(loading, fetchNextPage, hasNextPage && !isFetchingNextPage)

  return (
    <ResponsiveGrid>
      {books.map((book, k) => (
        <ClearIfNotVisible key={k} component={BookPreview} childProps={book} />
      ))}
      <div className="col-span-full text-center opacity-0" ref={loading}>
        Loading ...
      </div>
    </ResponsiveGrid>
  )
}

export const BookListOutlet = ({ libraryId }: { libraryId: UUID }) => {
  const [order, setOrder] = useState<Order>("ASC")
  const { total } = useBooks(libraryId, order)

  return (
    <>
      <ResourceListHeader title="Books" subtitle={pluralize(total, "book")} order={order} onOrderChange={setOrder} />
      <BookGrid key={order} libraryId={libraryId} order={order} />
    </>
  )
}
