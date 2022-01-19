import { getClient, withBaseUrl, withCaching, withErrorHandler } from "../Client"
import { environment } from "../env"
import {
  AuthorModel,
  AuthorModelWithBooks,
  BookModel,
  BookModelWithTracks,
  PatchBook,
  SeriesModel,
  SeriesModelWithBooks,
} from "./Audiobook"

const CLIENT = (() => {
  let client = withErrorHandler(withBaseUrl(getClient(), environment.apiURL))
  if (environment.production) {
    client = withCaching(client)
  }
  return client
})()

export const AudiobookClient = {
  // Authors
  fetchAuthors: (offset: number, limit = 30) =>
    CLIENT.get<AuthorModel[]>(`/audiobooks/authors?limit=${limit}&offset=${offset}`),
  fetchAuthorSorting: (offset: number, limit: number) =>
    CLIENT.get<string[]>(`/audiobooks/series?limit=${limit}&offset=${offset}`),
  fetchAuthorWithBooks: (authorID: string) => CLIENT.get<AuthorModelWithBooks>(`/audiobooks/authors/${authorID}`),
  // TODO
  updateAuthor: (data: any): any => null,

  // Books
  fetchBooks: (offset: number, limit = 30) =>
    CLIENT.get<BookModel[]>(`/audiobooks/books?limit=${limit}&offset=${offset}`),
  fetchBookSorting: (offset: number, limit: number) =>
    CLIENT.get<string[]>(`/audiobooks/series/sorting/?limit=${limit}&offset=${offset}`),
  fetchBookWithTracks: (bookID: string) => CLIENT.get<BookModelWithTracks>(`/audiobooks/books/${bookID}`),
  updateBook: ({ id, ...book }: Partial<PatchBook> & { id: string }) =>
    CLIENT.put<BookModel>(`/audiobooks/books/${id}`, book),

  // Series
  fetchSeries: (offset: number, limit = 30) =>
    CLIENT.get<SeriesModel[]>(`/audiobooks/series?limit=${limit}&offset=${offset}`),
  fetchSeriesSorting: (offset: number, limit: number) =>
    CLIENT.get<string[]>(`/audiobooks/series/sorting/?limit=${limit}&offset=${offset}`),
  fetchSeriesWithBooks: (seriesID: string) => CLIENT.get<SeriesModelWithBooks>(`/audiobooks/series/${seriesID}`),
  // TODO
  updateSeries: (data: any): any => null,

  // Misc
  rescan: () => CLIENT.post<null>(`/audiobooks/rescan`, {}),
}
