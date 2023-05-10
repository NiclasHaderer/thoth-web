import React, { FC, useState } from "react"
import { LibraryModel } from "@thoth/client"
import { useAudiobookState } from "@thoth/state/audiobook.state"
import { AudiobookSelectors } from "@thoth/state/audiobook.selectors"
import Link from "next/link"
import { MdImageNotSupported, MdPerson } from "react-icons/md"

export const LibraryPreview: FC<{ library: LibraryModel; showHeading?: boolean }> = ({
  library,
  showHeading = true,
}) => {
  const libraryBooks = useAudiobookState(AudiobookSelectors.selectBooks(library.id))
  const libraryBookCount = useAudiobookState(AudiobookSelectors.selectBookCount(library.id))
  const librarySeries = useAudiobookState(AudiobookSelectors.selectSeriesList(library.id))
  const librarySeriesCount = useAudiobookState(AudiobookSelectors.selectSeriesCount(library.id))
  const libraryAuthors = useAudiobookState(AudiobookSelectors.selectAuthors(library.id))
  const libraryAuthorsCount = useAudiobookState(AudiobookSelectors.selectAuthorCount(library.id))
  const [hovered, setHovered] = useState(false)

  return (
    <div className={`${hovered ? "bg-active" : ""} rounded-xl p-2`}>
      {showHeading && (
        <Link
          className="block"
          href={`/libraries/${library.id}`}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <h1 className="py-2 text-2xl font-medium">{library.name}</h1>
        </Link>
      )}

      <Link className="mt-4 block rounded-xl pb-4 pl-2 pt-2 hover:bg-active" href={`/libraries/${library.id}/books`}>
        <h2 className="mb-2 text-xl">{libraryBookCount} Books</h2>
        <div className="relative h-36">
          {libraryBooks.slice(0, 6).map((book, index) => (
            <div
              key={book.id}
              className="absolute top-0 h-full w-28 rounded-md bg-surface odd:bg-active"
              style={{ left: `${index * 4}rem` }}
            >
              {book.coverID ? (
                <img
                  className="h-28 w-auto rounded-md border-active-light object-contain"
                  alt={book.title}
                  src={`/api/stream/images/${book.coverID}`}
                />
              ) : (
                <MdImageNotSupported className="h-28 w-auto rounded-md border-active-light" />
              )}
              <p className="absolute bottom-0 w-full overflow-hidden text-ellipsis whitespace-nowrap pl-2">
                {book.title}
              </p>
            </div>
          ))}
        </div>
      </Link>

      <Link className="mt-4 block rounded-xl pb-4 pl-2 pt-2 hover:bg-active" href={`/libraries/${library.id}/series`}>
        <h2 className="mb-2 text-xl">{librarySeriesCount} Series</h2>
        <div className="relative h-36">
          {librarySeries.slice(0, 6).map((series, index) => (
            <div
              key={series.id}
              className="absolute top-0 h-full w-28 rounded-md bg-surface odd:bg-active"
              style={{ left: `${index * 4}rem` }}
            >
              {series.coverID ? (
                <img
                  className="h-28 w-auto rounded-md border-active-light object-contain"
                  alt={series.title}
                  src={`/api/stream/images/${series.coverID}`}
                />
              ) : (
                <MdImageNotSupported className="h-28 w-auto rounded-md border-active-light" />
              )}
              <p className="absolute bottom-0 w-full overflow-hidden text-ellipsis whitespace-nowrap pl-2">
                {series.title}
              </p>
            </div>
          ))}
        </div>
      </Link>

      <Link className="mt-4 block rounded-xl pb-4 pl-2 pt-2 hover:bg-active" href={`/libraries/${library.id}/authors`}>
        <h2 className="mb-2 text-xl">{libraryAuthorsCount} Authors</h2>
        <div className="relative h-36">
          {libraryAuthors.slice(0, 6).map((author, index) => (
            <div
              key={author.id}
              className="absolute top-0 h-full w-28 rounded-md bg-surface odd:bg-active"
              style={{ left: `${index * 4}rem` }}
            >
              {author.imageID ? (
                <img
                  className="h-28 w-auto rounded-md border-active-light object-contain"
                  alt={author.name}
                  src={`/api/stream/images/${author.imageID}`}
                />
              ) : (
                <MdPerson className="h-28 w-auto rounded-md border-active-light" />
              )}
              <p className="absolute bottom-0 w-full overflow-hidden text-ellipsis whitespace-nowrap pl-2">
                {author.name}
              </p>
            </div>
          ))}
        </div>
      </Link>
    </div>
  )
}
