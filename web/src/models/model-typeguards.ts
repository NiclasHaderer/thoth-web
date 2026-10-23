import { Author, AuthorDetailed, Book, BookDetailed, Series, SeriesDetailed } from "../client"

export const isDetailedAuthor = (author: Author | AuthorDetailed): author is AuthorDetailed => "books" in author
export const isDetailedBook = (book: Book | BookDetailed): book is BookDetailed => "tracks" in book
export const isDetailedSeries = (series: Series | SeriesDetailed): series is SeriesDetailed => "books" in series
