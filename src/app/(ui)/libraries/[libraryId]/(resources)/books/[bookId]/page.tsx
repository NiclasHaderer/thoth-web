"use client"
import { UUID } from "@thoth/client"
import { useAudiobookState } from "@thoth/state/audiobook.state"
import { AudiobookSelectors } from "@thoth/state/audiobook.selectors"
import { useEffect } from "react"
import { BookDisplay } from "@thoth/components/book/book"

export default function BookOutlet({ params: { bookId, libraryId } }: { params: { libraryId: UUID; bookId: UUID } }) {
  const fetchBook = useAudiobookState(s => s.fetchBookDetails)
  const book = useAudiobookState(AudiobookSelectors.selectBook(libraryId, bookId))
  useEffect(() => {
    fetchBook(libraryId, bookId)
  })
  return book && <BookDisplay {...book} />
}
