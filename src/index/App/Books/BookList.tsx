import React, { useRef } from "react"
import { useInfinityScroll } from "../../Hooks/InfinityScroll"
import { useScrollTo } from "../../Hooks/ScrollToTop"
import { AudiobookSelectors } from "../../State/Audiobook.Selectors"
import { useAudiobookState } from "../../State/Audiobook.State"
import { CleanIfNotVisible } from "../Common/CleanIfNotVisible"
import { ResponsiveGrid } from "../Common/ResponsiveGrid"
import { Book } from "./Book"

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
