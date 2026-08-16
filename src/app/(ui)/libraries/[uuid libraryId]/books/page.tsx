import { Order, UUID } from "@/client"
import { BookPreview } from "@/components/book/book-preview.tsx"
import { ClearIfNotVisible } from "@/components/clear-if-not-visible.tsx"
import { ResourceListHeader } from "@/components/resource-list-header.tsx"
import { ResponsiveGrid } from "@/components/responsive-grid.tsx"
import { useInfinityScroll } from "@/hooks/infinity-scroll.ts"
import { useScrollTo } from "@/hooks/scroll-to-top.ts"
import { useBooks } from "@/queries/resources.ts"
import { pluralize } from "@/utils/utils.ts"
import { FC, useRef, useState } from "react"

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
