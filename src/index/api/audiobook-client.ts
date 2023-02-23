import { getClient, withBaseUrl, withErrorHandler } from "../client"
import { environment } from "../env"
import {
  AuthorModel,
  AuthorModelWithBooks,
  BookModel,
  BookModelWithTracks,
  PaginatedResponse,
  PatchBook,
  PatchSeries,
  Position,
  PostAuthor,
  SeriesModel,
  SeriesModelWithBooks,
} from "../models/api"

const CLIENT = withErrorHandler(withBaseUrl(getClient(), environment.apiURL))

export const AudiobookClient = {
  // Authors
  fetchAuthors: (offset: number, limit = 30) =>
    CLIENT.get<PaginatedResponse<AuthorModel>>(`/audiobooks/authors`, { limit, offset }),
  fetchAuthorSorting: (offset: number, limit: number) => CLIENT.get<string[]>(`/audiobooks/series`, { limit, offset }),
  fetchAuthorWithBooks: (authorID: string) => CLIENT.get<AuthorModelWithBooks>(`/audiobooks/authors/${authorID}`),
  updateAuthor: ({ id, ...author }: PostAuthor & { id: string }) =>
    CLIENT.post<AuthorModelWithBooks, PostAuthor>(`/audiobooks/authors/${id}`, author),
  fetchAuthorPosition: (authorID: string) => CLIENT.get<Position>(`/audiobooks/authors/${authorID}/position`),

  // Books
  fetchBooks: (offset: number, limit = 30) =>
    CLIENT.get<PaginatedResponse<BookModel>>(`/audiobooks/books`, { limit, offset }),
  fetchBookSorting: (offset: number, limit: number) =>
    CLIENT.get<string[]>(`/audiobooks/series/sorting`, {
      limit,
      offset,
    }),
  fetchBookWithTracks: (bookID: string) => CLIENT.get<BookModelWithTracks>(`/audiobooks/books/${bookID}`),
  updateBook: ({ id, ...book }: PatchBook & { id: string }) =>
    CLIENT.patch<BookModel, Partial<PatchBook>>(`/audiobooks/books/${id}`, book),
  fetchBookPosition: (bookID: string) => CLIENT.get<Position>(`/audiobooks/books/${bookID}/position`),

  // Series
  fetchSeries: (offset: number, limit = 30) =>
    CLIENT.get<PaginatedResponse<SeriesModel>>(`/audiobooks/series`, { limit, offset }),
  fetchSeriesSorting: (offset: number, limit: number) =>
    CLIENT.get<string[]>(`/audiobooks/series/sorting`, {
      limit,
      offset,
    }),
  fetchSeriesWithBooks: (seriesID: string) => CLIENT.get<SeriesModelWithBooks>(`/audiobooks/series/${seriesID}`),
  updateSeries: ({ id, ...series }: PatchSeries & { id: string }) =>
    CLIENT.patch<SeriesModelWithBooks, PatchSeries>(`/audiobooks/series/${id}`, series),
  fetchSeriesPosition: (seriesID: string) => CLIENT.get<Position>(`/audiobooks/series/${seriesID}/position`),

  // Misc
  rescan: () => CLIENT.post<null, object>(`/audiobooks/rescan`, {}),
}
