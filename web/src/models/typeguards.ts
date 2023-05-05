import {
  AuthorModel,
  BookModel,
  DetailedAuthorModel,
  DetailedBookModel,
  DetailedSeriesModel,
  SeriesModel,
} from "../client"

export const isDetailedAuthor = (author: AuthorModel | DetailedAuthorModel): author is DetailedAuthorModel =>
  "books" in author
export const isDetailedBook = (book: BookModel | DetailedBookModel): book is DetailedBookModel => "tracks" in book
export const isDetailedSeries = (series: SeriesModel | DetailedSeriesModel): series is DetailedSeriesModel =>
  "books" in series
