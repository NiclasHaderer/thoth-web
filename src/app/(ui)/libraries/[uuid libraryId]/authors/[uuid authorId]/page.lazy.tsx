import { UUID } from "@/client"
import AuthorDetails from "@/components/author/author-details.tsx"

export const AuthorOutlet = ({ libraryId, authorId }: { libraryId: UUID; authorId: UUID }) => {
  return <AuthorDetails authorId={authorId} libraryId={libraryId} />
}
