import { UUID } from "@thoth/client"
import BookDetails from "@thoth/components/book/book-details"
import { use } from "react"

export const BookOutlet = ({ params }: { params: Promise<{ libraryId: UUID; bookId: UUID }> }) => {
  const { bookId } = use(params)
  return <BookDetails bookId={bookId} />
}
