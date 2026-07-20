import { useRef } from "react"
import { UUID } from "@thoth/client"
import { BookPreview } from "@thoth/components/book/book-preview.tsx"
import { ClearIfNotVisible } from "@thoth/components/clear-if-not-visible.tsx"
import { ResponsiveGrid } from "@thoth/components/responsive-grid"
import { useInfinityScroll } from "@thoth/hooks/infinity-scroll"
import { useScrollTo } from "@thoth/hooks/scroll-to-top"
import { AudiobookSelectors } from "@thoth/state/audiobook.selectors"
import { useAudiobookState } from "@thoth/state/audiobook.state"

export const BookListOutlet = ({ libraryId }: { libraryId: UUID }) => {
  const getBooks = useAudiobookState(s => s.fetchBooks)
  const loading = useRef<HTMLDivElement>(null)
  useScrollTo("main")
  useInfinityScroll(loading, offset => getBooks({ libraryId, offset }))
  const books = useAudiobookState(AudiobookSelectors.selectBooks(libraryId))
  const bookCount = useAudiobookState(AudiobookSelectors.selectBookCount(libraryId))

  return (
    <>
      {<h2 className="p-2 pb-6 text-2xl">{bookCount} Books</h2>}
      <ResponsiveGrid>
        {books.map((book, k) => (
          <ClearIfNotVisible key={k} component={BookPreview} childProps={book} />
        ))}
        <div className="min-w-full text-center opacity-0" ref={loading}>
          Loading ...
        </div>
      </ResponsiveGrid>
    </>
  )
}
