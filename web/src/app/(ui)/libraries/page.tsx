"use client"
import { useAudiobookState } from "@thoth/state/audiobook.state"
import { AudiobookSelectors } from "@thoth/state/audiobook.selectors"
import { useOnMount } from "@thoth/hooks/lifecycle"
import { useRouter } from "next/navigation"
import React, { FC } from "react"
import { LibraryModel } from "@thoth/client"
import { MdImageNotSupported, MdPerson } from "react-icons/md"
import Link from "next/link"
import Image from "next/image"

export default function LibrariesOutlet() {
  const libraries = useAudiobookState(AudiobookSelectors.libraries)
  const fetchLibraries = useAudiobookState(s => s.fetchLibraries)
  const fetchBooks = useAudiobookState(s => s.fetchBooks)
  const fetchSeries = useAudiobookState(s => s.fetchSeries)
  const fetchAuthors = useAudiobookState(s => s.fetchAuthors)
  const audiobookState = useAudiobookState()

  const router = useRouter()
  useOnMount(() => {
    fetchLibraries().then(libs => {
      if (!libs.success) return console.error(libs.error)
      if (libs.body.length === 0) router.push("/settings")
      libs.body.forEach(lib => {
        fetchBooks({ libraryId: lib.id, offset: 0 })
        fetchSeries({ libraryId: lib.id, offset: 0 })
        fetchAuthors({ libraryId: lib.id, offset: 0 })
      })
    })
  })
  return (
    <>
      <div className="mx-10">
        {libraries.map(library => (
          <LibraryPreview key={library.id} library={library} />
        ))}
      </div>
    </>
  )
}

const LibraryPreview: FC<{ library: LibraryModel }> = ({ library }) => {
  const libraryBooks = useAudiobookState(AudiobookSelectors.selectBooks(library.id))
  const libraryBookCount = useAudiobookState(AudiobookSelectors.selectBookCount(library.id))
  const librarySeries = useAudiobookState(AudiobookSelectors.selectSeriesList(library.id))
  const librarySeriesCount = useAudiobookState(AudiobookSelectors.selectSeriesCount(library.id))
  const libraryAuthors = useAudiobookState(AudiobookSelectors.selectAuthors(library.id))
  const libraryAuthorsCount = useAudiobookState(AudiobookSelectors.selectAuthorCount(library.id))
  return (
    <div>
      <Link className="hover:underline" href={`/libraries/${library.id}`}>
        <h1 className="mb-2 text-2xl font-medium">{library.name}</h1>
      </Link>

      <Link className="block" href={`/libraries/${library.id}/books`}>
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

      <Link className="mt-4 block" href={`/libraries/${library.id}/series`}>
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

      <Link className="mt-4 block" href={`/libraries/${library.id}/authors`}>
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
