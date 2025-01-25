import React, { FC, KeyboardEvent, useEffect, useRef, useState } from "react"
import { MdImageNotSupported, MdPerson, MdSearch } from "react-icons/md"

import { useFocusTrap } from "../../hooks/trap-focus"
import { useGlobalEvent } from "../../hooks/global-events"
import { SearchModel } from "@thoth/client"
import { Input } from "@thoth/components/input/input"
import { Api } from "@thoth/client"
import { Link } from "wouter"

export const Search: FC = () => {
  const [input, setInput] = useState("")
  const [searchResult, setSearchResult] = useState<SearchModel | null>(null)
  const [resultVisible, setResultVisible] = useState(false)
  const [searchOverlay, setSearchOverlay] = useState<HTMLDivElement | null>(null)
  const inputElement = useRef<HTMLInputElement | null>(null)
  const { focusPrevious, focusNext } = useFocusTrap(searchOverlay, () => !resultVisible)
  const timeout = useRef<number>(undefined)

  useGlobalEvent(
    "keyup",
    () => {
      setResultVisible(false)
    },
    event => event.key === "Escape"
  )

  useGlobalEvent("click", (event: MouseEvent) => {
    if (!searchOverlay?.contains(event.target as HTMLElement) && inputElement.current !== event.target) {
      setResultVisible(false)
    }
  })

  const modifyFocus = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowUp") {
      event.preventDefault()
      focusPrevious()
    } else if (event.key === "ArrowDown") {
      event.preventDefault()
      focusNext()
    }
  }

  useEffect(() => {
    if (input === "") {
      setResultVisible(false)
      return
    }

    setResultVisible(true)
    clearTimeout(timeout.current)
    timeout.current = setTimeout(async () => {
      const result = await Api.searchInAllLibraries({ q: input })
      result.success && setSearchResult(result.body)
    }, 100) as unknown as number

    return () => clearTimeout(timeout.current)
  }, [input])

  return (
    <div className="relative flex-grow px-3 shadow-none" onKeyDown={modifyFocus} ref={setSearchOverlay}>
      <Input
        className="rounded-3xl bg-elevate-2 !pl-11"
        leftIcon={<MdSearch className="mx-1 h-6 w-6" />}
        placeholder="Search ..."
        inputRef={inputElement}
        onKeyUp={event => setInput((event.target as HTMLInputElement).value)}
        onFocus={event => {
          if ((event.target as HTMLInputElement).value.trim() !== "") {
            setResultVisible(true)
          }
        }}
        onClick={event => {
          if ((event.target as HTMLInputElement).value.trim() !== "") {
            setResultVisible(true)
          }
        }}
      />
      {searchResult && resultVisible ? (
        <div className="absolute bottom-0 left-0 right-0 z-10 mx-3 translate-y-full overflow-hidden rounded-md bg-surface p-3 shadow-2xl">
          <SearchResults search={searchResult} onClose={() => setResultVisible(false)} />
        </div>
      ) : null}
    </div>
  )
}

const SearchResults: React.FC<{ search: SearchModel; onClose: () => void }> = ({ search, onClose }) => (
  <>
    {search.books.length || search.authors.length || search.series.length ? (
      <>
        {search.books.length ? (
          <>
            <h2 className="py-3 uppercase text-font-secondary">Books</h2>
            <BookSearchResult books={search.books} onClose={onClose} />
          </>
        ) : null}
        {search.authors.length ? (
          <>
            <h2 className="py-3 uppercase text-font-secondary">Authors</h2>
            <AuthorSearchResult authors={search.authors} onClose={onClose} />
          </>
        ) : null}
        {search.series.length ? (
          <>
            <h2 className="py-3 uppercase text-font-secondary">Series</h2>
            <SeriesSearchResult series={search.series} onClose={onClose} />
          </>
        ) : null}
      </>
    ) : (
      <div>Nothing was found</div>
    )}
  </>
)

const AuthorSearchResult: React.FC<{ authors: SearchModel["authors"]; onClose: () => void }> = ({
  authors,
  onClose,
}) => (
  <>
    {authors.map((author, i) => (
      <Link
        href={`/authors/${author.id}`}
        onClick={onClose}
        key={i}
        aria-label={author.name}
        className="block rounded-md transition-colors hover:bg-active-light no-touch:focus:bg-active-light"
      >
        <div className="flex items-center p-2">
          {author.imageID ? (
            <img
              className="h-8 w-8 rounded-full"
              src={`/api/stream/images/${author.imageID}`}
              alt="Author"
              loading="lazy"
            />
          ) : (
            <MdPerson className="h-8 w-8 rounded-full" />
          )}
          <h4 className="pl-3">{author.name}</h4>
        </div>
      </Link>
    ))}
  </>
)

const BookSearchResult: React.FC<{ books: SearchModel["books"]; onClose: () => void }> = ({ books, onClose }) => (
  <>
    {books.map((book, i) => (
      <Link
        href={`/books/${book.id}`}
        onClick={onClose}
        key={i}
        aria-label={book.title}
        className="block rounded-md transition-colors hover:bg-active-light no-touch:focus:bg-active-light"
      >
        <div className="flex items-center p-2">
          {book.coverID ? (
            <img
              className="h-8 w-8 rounded-md object-cover"
              src={`/api/stream/images/${book.coverID}`}
              alt={book.title}
              loading="lazy"
            />
          ) : (
            <MdImageNotSupported className="h-8 w-8 rounded-full" />
          )}
          <h4 className="pl-3">{book.title}</h4>
        </div>
      </Link>
    ))}
  </>
)

const SeriesSearchResult: React.FC<{ series: SearchModel["series"]; onClose: () => void }> = ({ series, onClose }) => (
  <>
    {series.map((series, i) => (
      <Link
        href={`/series/${series.id}`}
        onClick={onClose}
        key={i}
        aria-label={series.title}
        className="block rounded-md transition-colors hover:bg-active-light no-touch:focus:bg-active-light"
      >
        <div className="flex items-center p-2">
          <MdImageNotSupported className="h-8 w-8 rounded-md" />
          <h4 className="pl-3">{series.title}</h4>
        </div>
      </Link>
    ))}
  </>
)
