import { FC } from "react"
import { Link } from "wouter"
import { Library } from "@thoth/client"
import { AuthorPreview } from "@thoth/components/author/author-preview.tsx"
import { BookPreview } from "@thoth/components/book/book-preview.tsx"
import { ScrollRow } from "@thoth/components/scroll-row"
import { SeriesPreview } from "@thoth/components/series/series-preview.tsx"
import { AudiobookSelectors } from "@thoth/state/audiobook.selectors"
import { useAudiobookState } from "@thoth/state/audiobook.state"

export const LibraryPreview: FC<{ library: Library; libraryCount: number }> = ({ library, libraryCount }) => {
  const libraryBooks = useAudiobookState(AudiobookSelectors.selectBooks(library.id))
  const librarySeries = useAudiobookState(AudiobookSelectors.selectSeriesList(library.id))
  const libraryAuthors = useAudiobookState(AudiobookSelectors.selectAuthors(library.id))

  return (
    <div>
      {libraryCount > 1 && (
        <Link
          className="block text-2xl font-bold decoration-1 hover:underline focus-visible:underline focus-visible:outline-none"
          href={`/libraries/${library.id}`}
        >
          {library.name}
        </Link>
      )}

      <ScrollRow title="Books" href={`/libraries/${library.id}/books`}>
        {libraryBooks.slice(0, 6).map((book, index) => (
          <BookPreview size="small" {...book} className="mx-3 align-top first:ml-0!" key={index} />
        ))}
      </ScrollRow>

      <ScrollRow title="Series" href={`/libraries/${library.id}/series`}>
        {librarySeries.slice(0, 6).map((series, index) => (
          <SeriesPreview size="small" {...series} className="mx-3 align-top first:ml-0!" key={index} />
        ))}
      </ScrollRow>

      <ScrollRow title="Authors" href={`/libraries/${library.id}/authors`}>
        {libraryAuthors.slice(0, 6).map((author, index) => (
          <AuthorPreview size="small" {...author} className="mx-3 align-top first:ml-0!" key={index} />
        ))}
      </ScrollRow>
    </div>
  )
}
