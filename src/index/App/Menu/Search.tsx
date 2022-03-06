import React, { KeyboardEvent, useEffect, useRef, useState } from "react"
import { MdImageNotSupported, MdPerson, MdSearch } from "react-icons/md"

import { SearchModel } from "../../API/models/Audiobook"
import { environment } from "../../env"
import { useFocusTrap, useTabModifier } from "../../Hooks/FocusTrap"
import { useGlobalEvent } from "../../Hooks/GlobalEvent"
import { ALink } from "../Common/ActiveLink"
import { Input } from "../Common/Input"
import { SEARCH_CLIENT } from "../../API/SearchClient"

export const Search: React.VFC = () => {
  const [input, setInput] = useState("")
  const [searchResult, setSearchResult] = useState<SearchModel | null>(null)
  const [resultVisible, setResultVisible] = useState(false)
  const [searchOverlay, setSearchOverlay] = useState<HTMLDivElement | null>(null)
  const inputElement = useRef<HTMLInputElement | null>(null)
  useFocusTrap(searchOverlay, () => !resultVisible)
  const { focusPrevious, focusNext } = useTabModifier()
  const timeout = useRef<number>()

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
      const result = await SEARCH_CLIENT.search(input)
      result && setSearchResult(result)
    }, 100) as unknown as number

    return () => clearTimeout(timeout.current)
  }, [input])

  return (
    <div className="relative flex-grow px-3 shadow-none" onKeyDown={modifyFocus} ref={setSearchOverlay}>
      <Input
        className="rounded-3xl bg-elevate-1 pl-11"
        icon={<MdSearch className="mx-1 h-6 w-6" />}
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

const SearchResults: React.VFC<{ search: SearchModel; onClose: () => void }> = ({ search, onClose }) => (
  <>
    <h2 className="py-3 uppercase text-unimportant">Books</h2>
    <BookSearchResult books={search.books} onClose={onClose} />
    <h2 className="py-3 uppercase text-unimportant">Authors</h2>
    <AuthorSearchResult authors={search.authors} onClose={onClose} />
    <h2 className="py-3 uppercase text-unimportant">Series</h2>
    <SeriesSearchResult series={search.series} onClose={onClose} />
  </>
)

const AuthorSearchResult: React.VFC<{ authors: SearchModel["authors"]; onClose: () => void }> = ({
  authors,
  onClose,
}) => (
  <>
    {authors.length === 0 ? (
      <div>No authors found</div>
    ) : (
      authors.map((author, i) => (
        <ALink
          href={`/authors/${author.id}`}
          onClick={onClose}
          key={i}
          aria-label={author.name}
          className="block rounded-md transition-colors hover:bg-active-light no-touch:focus:bg-active-light"
        >
          <div className="flex items-center p-2">
            {author.image ? (
              <img
                className="h-8 w-8 rounded-full"
                src={`${environment.apiURL}/image/${author.image}`}
                alt="Author"
                loading="lazy"
              />
            ) : (
              <MdPerson className="h-8 w-8 rounded-full" />
            )}
            <h4 className="pl-3">{author.name}</h4>
          </div>
        </ALink>
      ))
    )}
  </>
)

const BookSearchResult: React.VFC<{ books: SearchModel["books"]; onClose: () => void }> = ({ books, onClose }) => (
  <>
    {books.length === 0 ? (
      <div>No book found</div>
    ) : (
      books.map((book, i) => (
        <ALink
          href={`/books/${book.id}`}
          onClick={onClose}
          key={i}
          aria-label={book.title}
          className="block rounded-md transition-colors hover:bg-active-light no-touch:focus:bg-active-light"
        >
          <div className="flex items-center p-2">
            {book.cover ? (
              <img
                className="h-8 w-8 rounded-md object-cover"
                src={`${environment.apiURL}/image/${book.cover}`}
                alt={book.title}
                loading="lazy"
              />
            ) : (
              <MdImageNotSupported className="h-8 w-8 rounded-full" />
            )}
            <h4 className="pl-3">{book.title}</h4>
          </div>
        </ALink>
      ))
    )}
  </>
)

const SeriesSearchResult: React.VFC<{ series: SearchModel["series"]; onClose: () => void }> = ({ series, onClose }) => (
  <>
    {series.length === 0 ? (
      <div>No series found</div>
    ) : (
      series.map((series, i) => (
        <ALink
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
        </ALink>
      ))
    )}
  </>
)
