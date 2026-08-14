import { FC, useRef, useState } from "react"
import { Order, UUID } from "@thoth/client"
import { BookPreview } from "@thoth/components/book/book-preview.tsx"
import { ClearIfNotVisible } from "@thoth/components/clear-if-not-visible.tsx"
import { ResourceListHeader } from "@thoth/components/resource-list-header"
import { ResponsiveGrid } from "@thoth/components/responsive-grid"
import { useInfinityScroll } from "@thoth/hooks/infinity-scroll"
import { useScrollTo } from "@thoth/hooks/scroll-to-top"
import { AudiobookSelectors } from "@thoth/state/audiobook.selectors"
import { useAudiobookState } from "@thoth/state/audiobook.state"
import { pluralize } from "@thoth/utils/utils"

const BookGrid: FC<{ libraryId: UUID; order: Order }> = ({ libraryId, order }) => {
  const getBooks = useAudiobookState(s => s.fetchBooks)
  const loading = useRef<HTMLDivElement>(null)
  useScrollTo("main")
  useInfinityScroll(loading, offset => getBooks({ libraryId, offset, order }))
  const books = useAudiobookState(AudiobookSelectors.selectBooks(libraryId))

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
  const clearBooks = useAudiobookState(s => s.clearBook)
  const bookCount = useAudiobookState(AudiobookSelectors.selectBookCount(libraryId))

  return (
    <>
      <ResourceListHeader
        title="Books"
        subtitle={pluralize(bookCount, "book")}
        order={order}
        onOrderChange={next => {
          clearBooks(libraryId)
          setOrder(next)
        }}
      />
      <BookGrid key={order} libraryId={libraryId} order={order} />
    </>
  )
}
