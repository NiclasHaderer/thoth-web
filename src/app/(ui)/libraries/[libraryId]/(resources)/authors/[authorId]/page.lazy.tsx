import { useEffect } from "react"
import { useAudiobookState } from "@thoth/state/audiobook.state"
import { AudiobookSelectors } from "@thoth/state/audiobook.selectors"
import { UUID } from "@thoth/client"
import { AuthorDisplay } from "@thoth/components/author/author-display"

export const AuthorOutlet = ({ libraryId, authorId }: { libraryId: UUID; authorId: UUID }) => {
  const fetchAuthor = useAudiobookState(s => s.fetchAuthorDetails)
  const author = useAudiobookState(AudiobookSelectors.selectAuthor(libraryId, authorId))
  useEffect(() => {
    void fetchAuthor({ libraryId, id: authorId })
  }, [libraryId, authorId, fetchAuthor])

  return author && <AuthorDisplay {...author} />
}
