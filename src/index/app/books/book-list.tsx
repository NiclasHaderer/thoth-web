import React, { useRef } from "react"
import { useInfinityScroll } from "../../hooks/infinity-scroll"
import { useScrollTo } from "../../hooks/scroll-to-top"
import { AudiobookSelectors } from "../../state/audiobook.selectors"
import { useAudiobookState } from "../../state/audiobook.state"
import { CleanIfNotVisible } from "../common/clean-if-not-visible"
import { ResponsiveGrid } from "../common/responsive-grid"
import { Book } from "./book"

export const BookList: React.VFC = () => {
  const getBooks = useAudiobookState(AudiobookSelectors.fetchBooks)
  const loading = useRef<HTMLDivElement>(null)
  useScrollTo("main")
  useInfinityScroll(loading.current, getBooks)
  const books = useAudiobookState(AudiobookSelectors.selectBooks)
  const bookCount = useAudiobookState(AudiobookSelectors.selectBookCount)

  return (
    <>
      {bookCount != null ? <h2 className="p-2 pb-6 text-2xl">{bookCount} Books</h2> : null}
      <ResponsiveGrid>
        {books.map((book, k) => (
          <CleanIfNotVisible key={k}>
            <Book {...book} />
          </CleanIfNotVisible>
        ))}
        <div className="min-w-full text-center opacity-0" ref={loading}>
          Loading ...
        </div>
      </ResponsiveGrid>
    </>
  )
}
export default BookList
