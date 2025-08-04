import { UUID } from "@thoth/client"
import AuthorDetails from "@thoth/components/author/author-details.tsx"

export const AuthorOutlet = ({ libraryId, authorId }: { libraryId: UUID; authorId: UUID }) => {
  return <AuthorDetails authorId={authorId} libraryId={libraryId} />
}
