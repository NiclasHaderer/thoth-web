import { UUID } from "@/client"
import BookDetails from "@/components/book/book-details"

export const BookOutlet = ({ libraryId, bookId }: { libraryId: UUID; bookId: UUID }) => {
  return <BookDetails bookId={bookId} libraryId={libraryId} />
}
