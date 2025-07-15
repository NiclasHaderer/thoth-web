import { Redirect } from "wouter"
import { UUID } from "@thoth/client"

export const LibraryIdOutlet = ({ libraryId }: { libraryId: UUID }) => {
  return <Redirect to={`/libraries/${libraryId}/books`} replace={true} />
}
