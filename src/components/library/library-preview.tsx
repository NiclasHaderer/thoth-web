import { FC } from "react"
import { UUID } from "@thoth/client"
import { AuthorPreview } from "@thoth/components/author/author-preview.tsx"
import { BookPreview } from "@thoth/components/book/book-preview.tsx"
import { ScrollRow } from "@thoth/components/scroll-row"
import { SeriesPreview } from "@thoth/components/series/series-preview.tsx"
import { AudiobookSelectors } from "@thoth/state/audiobook.selectors"
import { useAudiobookState } from "@thoth/state/audiobook.state"

export const LibraryPreview: FC<{ libraryId: UUID }> = ({ libraryId }) => {
  const libraryBooks = useAudiobookState(AudiobookSelectors.selectBooks(libraryId))
  const librarySeries = useAudiobookState(AudiobookSelectors.selectSeriesList(libraryId))
  const libraryAuthors = useAudiobookState(AudiobookSelectors.selectAuthors(libraryId))

  return (
    <div>
      <ScrollRow title="Books" href={`/libraries/${libraryId}/books`}>
        {libraryBooks.slice(0, 6).map((book, index) => (
          <BookPreview size="small" {...book} className="mx-3 align-top first:ml-0!" key={index} />
        ))}
      </ScrollRow>

      <ScrollRow title="Series" href={`/libraries/${libraryId}/series`}>
        {librarySeries.slice(0, 6).map((series, index) => (
          <SeriesPreview size="small" {...series} className="mx-3 align-top first:ml-0!" key={index} />
        ))}
      </ScrollRow>

      <ScrollRow title="Authors" href={`/libraries/${libraryId}/authors`}>
        {libraryAuthors.slice(0, 6).map((author, index) => (
          <AuthorPreview size="small" {...author} className="mx-3 align-top first:ml-0!" key={index} />
        ))}
      </ScrollRow>
    </div>
  )
}
