import { UUID } from "@thoth/client"
import { Redirect } from "wouter"

export const LibraryIdOutlet = ({ libraryId }: { libraryId: UUID }) => {
  return <Redirect to={`/libraries/${libraryId}/books`} />
}
