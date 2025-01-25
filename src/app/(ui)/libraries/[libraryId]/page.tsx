import { UUID } from "@thoth/client"
import { Redirect } from "wouter"

export const LibraryIdOutlet = ({ params: { libraryId } }: { params: { libraryId: UUID } }) => {
  return <Redirect to={`/libraries/${libraryId}/books`} />
}
