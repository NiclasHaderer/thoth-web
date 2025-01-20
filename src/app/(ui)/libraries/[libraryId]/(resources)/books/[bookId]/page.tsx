"use client"

import { UUID } from "@thoth/client"
import BookDetails from "@thoth/components/book/book-details"

export default function BookOutlet({ params: { bookId } }: { params: { libraryId: UUID; bookId: UUID } }) {
  return <BookDetails bookId={bookId} />
}
