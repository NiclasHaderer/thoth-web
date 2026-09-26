import { FC } from "react"
import { UUID } from "@thoth/client"
import { AuthorPreview } from "@thoth/components/author/author-preview.tsx"
import { BookPreview } from "@thoth/components/book/book-preview.tsx"
import { PreviewSkeleton } from "@thoth/components/generic/preview-skeleton"
import { ScrollRow } from "@thoth/components/scroll-row"
import { SeriesPreview } from "@thoth/components/series/series-preview.tsx"
import {
  useAuthorsPreview,
  useBooksPreview,
  useContinueListening,
  useSeriesPreview,
} from "@thoth/queries/resource-queries"

const PREVIEW_COUNT = 20
const PREVIEW_SPACING = "mx-3 align-top first:ml-0!"

const placeholders = (round?: boolean, subtitle?: boolean) =>
  Array.from({ length: 8 }, (_, index) => (
    <PreviewSkeleton key={index} size="small" round={round} subtitle={subtitle} className={PREVIEW_SPACING} />
  ))

export const LibraryPreview: FC<{ libraryId: UUID }> = ({ libraryId }) => {
  const libraryBooks = useBooksPreview(libraryId)
  const librarySeries = useSeriesPreview(libraryId)
  const libraryAuthors = useAuthorsPreview(libraryId)
  const continueListening = useContinueListening()

  return (
    <div>
      {continueListening.length > 0 ? (
        <ScrollRow title="Continue listening">
          {continueListening.map(book => (
            <BookPreview size="small" {...book} className={PREVIEW_SPACING} key={book.id} />
          ))}
        </ScrollRow>
      ) : null}

      <ScrollRow title="Books" href={`/libraries/${libraryId}/books`}>
        {libraryBooks.isPending
          ? placeholders(false, true)
          : libraryBooks.items
              .slice(0, PREVIEW_COUNT)
              .map((book, index) => <BookPreview size="small" {...book} className={PREVIEW_SPACING} key={index} />)}
      </ScrollRow>

      <ScrollRow title="Series" href={`/libraries/${libraryId}/series`}>
        {librarySeries.isPending
          ? placeholders()
          : librarySeries.items
              .slice(0, PREVIEW_COUNT)
              .map((series, index) => (
                <SeriesPreview size="small" {...series} className={PREVIEW_SPACING} key={index} />
              ))}
      </ScrollRow>

      <ScrollRow title="Authors" href={`/libraries/${libraryId}/authors`}>
        {libraryAuthors.isPending
          ? placeholders(true)
          : libraryAuthors.items
              .slice(0, PREVIEW_COUNT)
              .map((author, index) => (
                <AuthorPreview size="small" {...author} className={PREVIEW_SPACING} key={index} />
              ))}
      </ScrollRow>
    </div>
  )
}
