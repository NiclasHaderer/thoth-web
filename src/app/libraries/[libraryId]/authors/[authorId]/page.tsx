"use client"

import { useEffect } from "react"
import { useAudiobookState } from "@thoth/state/audiobook.state"
import { AudiobookSelectors } from "@thoth/state/audiobook.selectors"
import { UUID } from "@thoth/client"
import { AuthorDisplay } from "@thoth/components/author/author-display"

export default function AuthorOutlet({
  params: { authorId, libraryId },
}: {
  params: { libraryId: UUID; authorId: UUID }
}) {
  const fetchAuthor = useAudiobookState(s => s.fetchAuthorDetails)
  const author = useAudiobookState(AudiobookSelectors.selectAuthor(libraryId, authorId))
  useEffect(() => {
    fetchAuthor(libraryId, authorId)
  }, [libraryId, authorId, fetchAuthor])

  return author && <AuthorDisplay {...author} />
}
