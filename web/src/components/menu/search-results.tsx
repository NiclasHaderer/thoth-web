import { ImageOffIcon, UserIcon } from "lucide-react"
import { FC } from "react"
import { Link } from "wouter"
import { LibrarySearchResult } from "@thoth/client"

export const SearchResults: FC<{ search: LibrarySearchResult; onClose: () => void }> = ({ search, onClose }) => (
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
        href={`/libraries/${author.libraryId}/authors/${author.id}`}
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
        href={`/libraries/${book.libraryId}/books/${book.id}`}
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
        href={`/libraries/${series.libraryId}/series/${series.id}`}
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
