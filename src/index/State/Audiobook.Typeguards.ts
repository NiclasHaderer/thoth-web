import {
  AuthorModel,
  AuthorModelWithBooks,
  BookModel,
  BookModelWithTracks,
  SeriesModel,
  SeriesModelWithBooks,
} from "../API/Audiobook"

export const isAuthorWithBooks = (author: AuthorModel | AuthorModelWithBooks): author is AuthorModelWithBooks =>
  "books" in author
export const isBookWithTracks = (book: BookModel | BookModelWithTracks): book is BookModelWithTracks => "tracks" in book
export const isSeriesWithBooks = (series: SeriesModel | SeriesModelWithBooks): series is SeriesModelWithBooks =>
  "books" in series
