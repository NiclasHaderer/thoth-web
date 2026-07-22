import { UserIcon, SearchIcon, ImageOffIcon } from "lucide-react"
import { FC, KeyboardEvent, useEffect, useRef, useState } from "react"
import { Link } from "wouter"
import { Api, LibrarySearchResult } from "@thoth/client"
import { Input } from "@thoth/components/input/input"
import { useGlobalEvent } from "../../hooks/global-events"
import { useFocusTrap } from "../../hooks/trap-focus"

export const Search: FC = () => {
  const [input, setInput] = useState("")
  const [searchResult, setSearchResult] = useState<LibrarySearchResult | null>(null)
  const [resultVisible, setResultVisible] = useState(false)
  const [prevInput, setPrevInput] = useState("")
  const [searchOverlay, setSearchOverlay] = useState<HTMLDivElement | null>(null)
  const inputElement = useRef<HTMLInputElement | null>(null)
  const { focusPrevious, focusNext } = useFocusTrap(searchOverlay, () => !resultVisible)
  const timeout = useRef<number>(undefined)

  useGlobalEvent(
    "keyup",
    () => setResultVisible(false),
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

  if (input !== prevInput) {
    setPrevInput(input)
    setResultVisible(input !== "")
  }

  useEffect(() => {
    if (input === "") return

    clearTimeout(timeout.current)
    timeout.current = setTimeout(async () => {
      const result = await Api.searchInAllLibraries({ q: input })
      result.success && setSearchResult(result.body)
    }, 100) as unknown as number

    return () => clearTimeout(timeout.current)
  }, [input])

  return (
    <div className="relative grow px-3 shadow-none" onKeyDown={modifyFocus} ref={setSearchOverlay}>
      <Input
        hideError
        groupClassName="bg-popover dark:bg-popover focus-within:bg-accent dark:focus-within:bg-accent rounded-3xl! h-auto py-1 border-0 transition-colors has-[[data-slot=input-group-control]:focus-visible]:ring-0 has-[[data-slot=input-group-control]:focus-visible]:border-0"
        leftIcon={<SearchIcon className="mx-1 h-6 w-6" />}
        placeholder="Search ..."
        inputRef={inputElement}
        onKeyUp={event => setInput((event.target as HTMLInputElement).value)}
        onFocus={event => {
          if (event.target.value.trim() !== "") {
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
        <div className="bg-popover absolute right-0 bottom-0 left-0 z-10 mx-3 translate-y-full overflow-hidden rounded-md p-3 shadow-2xl">
          <SearchResults search={searchResult} onClose={() => setResultVisible(false)} />
        </div>
      ) : null}
    </div>
  )
}

const SearchResults: FC<{ search: LibrarySearchResult; onClose: () => void }> = ({ search, onClose }) => (
  <>
    {search.books.length || search.authors.length || search.series.length ? (
      <>
        {search.books.length ? (
          <>
            <h2 className="text-muted-foreground py-3 uppercase">Books</h2>
            <BookSearchResult books={search.books} onClose={onClose} />
          </>
        ) : null}
        {search.authors.length ? (
          <>
            <h2 className="text-muted-foreground py-3 uppercase">Authors</h2>
            <AuthorSearchResult authors={search.authors} onClose={onClose} />
          </>
        ) : null}
        {search.series.length ? (
          <>
            <h2 className="text-muted-foreground py-3 uppercase">Series</h2>
            <SeriesSearchResult series={search.series} onClose={onClose} />
          </>
        ) : null}
      </>
    ) : (
      <div>Nothing was found</div>
    )}
  </>
)

const AuthorSearchResult: FC<{ authors: LibrarySearchResult["authors"]; onClose: () => void }> = ({
  authors,
  onClose,
}) => (
  <>
    {authors.map((author, i) => (
      <Link
        href={`/libraries/${author.library.id}/authors/${author.id}`}
        onClick={onClose}
        key={i}
        aria-label={author.name}
        className="hover:bg-muted no-touch:focus:bg-muted block rounded-md transition-colors"
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
            <UserIcon className="h-8 w-8 rounded-full" />
          )}
          <h4 className="pl-3">{author.name}</h4>
        </div>
      </Link>
    ))}
  </>
)

const BookSearchResult: FC<{ books: LibrarySearchResult["books"]; onClose: () => void }> = ({ books, onClose }) => (
  <>
    {books.map((book, i) => (
      <Link
        href={`/libraries/${book.library.id}/books/${book.id}`}
        onClick={onClose}
        key={i}
        aria-label={book.title}
        className="hover:bg-muted no-touch:focus:bg-muted block rounded-md transition-colors"
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
            <ImageOffIcon className="h-8 w-8 rounded-full" />
          )}
          <h4 className="pl-3">{book.title}</h4>
        </div>
      </Link>
    ))}
  </>
)

const SeriesSearchResult: FC<{ series: LibrarySearchResult["series"]; onClose: () => void }> = ({
  series,
  onClose,
}) => (
  <>
    {series.map((series, i) => (
      <Link
        href={`/libraries/${series.library.id}/series/${series.id}`}
        onClick={onClose}
        key={i}
        aria-label={series.title}
        className="hover:bg-muted no-touch:focus:bg-muted block rounded-md transition-colors"
      >
        <div className="flex items-center p-2">
          <ImageOffIcon className="h-8 w-8 rounded-md" />
          <h4 className="pl-3">{series.title}</h4>
        </div>
      </Link>
    ))}
  </>
)
