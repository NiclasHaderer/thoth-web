import { FC } from "react"
import { UUID } from "@thoth/client"
import { AuthorPreview } from "@thoth/components/author/author-preview.tsx"
import { BookPreview } from "@thoth/components/book/book-preview.tsx"
import { ScrollRow } from "@thoth/components/scroll-row"
import { SeriesPreview } from "@thoth/components/series/series-preview.tsx"
import { useAuthors, useBooks, useSeriesList } from "@thoth/queries/resources"

const PREVIEW_COUNT = 20

export const LibraryPreview: FC<{ libraryId: UUID }> = ({ libraryId }) => {
  const { items: libraryBooks } = useBooks(libraryId)
  const { items: librarySeries } = useSeriesList(libraryId)
  const { items: libraryAuthors } = useAuthors(libraryId)

  return (
    <div>
      <ScrollRow title="Books" href={`/libraries/${libraryId}/books`}>
        {libraryBooks.slice(0, PREVIEW_COUNT).map((book, index) => (
          <BookPreview size="small" {...book} className="mx-3 align-top first:ml-0!" key={index} />
        ))}
      </ScrollRow>

      <ScrollRow title="Series" href={`/libraries/${libraryId}/series`}>
        {librarySeries.slice(0, PREVIEW_COUNT).map((series, index) => (
          <SeriesPreview size="small" {...series} className="mx-3 align-top first:ml-0!" key={index} />
        ))}
      </ScrollRow>

      <ScrollRow title="Authors" href={`/libraries/${libraryId}/authors`}>
        {libraryAuthors.slice(0, PREVIEW_COUNT).map((author, index) => (
          <AuthorPreview size="small" {...author} className="mx-3 align-top first:ml-0!" key={index} />
        ))}
      </ScrollRow>
    </div>
  )
}
