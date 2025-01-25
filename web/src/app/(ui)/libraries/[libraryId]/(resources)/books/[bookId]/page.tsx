import { UUID } from "@thoth/client"
import BookDetails from "@thoth/components/book/book-details"

export const BookOutlet = ({ libraryId, bookId }: { libraryId: UUID; bookId: UUID }) => {
  return <BookDetails bookId={bookId} libraryId={libraryId} />
}
