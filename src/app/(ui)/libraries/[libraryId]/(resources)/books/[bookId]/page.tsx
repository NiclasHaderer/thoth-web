"use client"
import { UUID } from "@thoth/client"
import { useAudiobookState } from "@thoth/state/audiobook.state"
import { AudiobookSelectors } from "@thoth/state/audiobook.selectors"
import { useEffect } from "react"
import { BookDisplay } from "@thoth/components/book/book"
import BookDetails from "@thoth/components/book/book-details"

export default function BookOutlet({ params: { bookId, libraryId } }: { params: { libraryId: UUID; bookId: UUID } }) {
  return <BookDetails bookId={bookId} />
}
