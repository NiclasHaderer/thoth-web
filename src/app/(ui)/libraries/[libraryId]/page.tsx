"use client"

import { UUID } from "@thoth/client"
import { Redirect } from "wouter"

export default function LibraryIdOutlet({ params: { libraryId } }: { params: { libraryId: UUID } }) {
  return <Redirect to={`/libraries/${libraryId}/books`} />
}
