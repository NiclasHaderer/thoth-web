"use client"

import { useAudiobookState } from "@thoth/state/audiobook.state"
import { AudiobookSelectors } from "@thoth/state/audiobook.selectors"
import React, { Fragment, use, useRef } from "react"
import { useScrollTo } from "@thoth/hooks/scroll-to-top"
import { useInfinityScroll } from "@thoth/hooks/infinity-scroll"
import { ResponsiveGrid } from "@thoth/components/responsive-grid"
import { CleanIfNotVisible } from "@thoth/components/clean-if-not-visible"
import { BookDisplay } from "@thoth/components/book/book"
import { UUID } from "@thoth/client"

export default function BookListOutlet({ params }: { params: Promise<{ libraryId: UUID }> }) {
  const { libraryId } = use(params)
  const getBooks = useAudiobookState(s => s.fetchBooks)
  const loading = useRef<HTMLDivElement>(null)
  useScrollTo("main")
  useInfinityScroll(loading.current, offset => getBooks({ libraryId, offset }))
  const books = useAudiobookState(AudiobookSelectors.selectBooks(libraryId))
  const bookCount = useAudiobookState(AudiobookSelectors.selectBookCount(libraryId))

  return (
    <>
      {<h2 className="p-2 pb-6 text-2xl">{bookCount} Books</h2>}
      <ResponsiveGrid>
        {books.map((book, k) => (
          <CleanIfNotVisible key={k}>
            <BookDisplay {...book} />
          </CleanIfNotVisible>
        ))}
        <div className="min-w-full text-center opacity-0" ref={loading}>
          Loading ...
        </div>
      </ResponsiveGrid>
    </>
  )
}
