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
  fetchAuthors: (offset: number, limit = 30) => CLIENT.get<AuthorModel[]>(`/audiobooks/authors`, { limit, offset }),
  fetchAuthorSorting: (offset: number, limit: number) => CLIENT.get<string[]>(`/audiobooks/series`, { limit, offset }),
  fetchAuthorWithBooks: (authorID: string) => CLIENT.get<AuthorModelWithBooks>(`/audiobooks/authors/${authorID}`),
  // TODO
  updateAuthor: (data: any): any => null,

  // Books
  fetchBooks: (offset: number, limit = 30) => CLIENT.get<BookModel[]>(`/audiobooks/books`, { limit, offset }),
  fetchBookSorting: (offset: number, limit: number) =>
    CLIENT.get<string[]>(`/audiobooks/series/sorting`, {
      limit,
      offset,
    }),
  fetchBookWithTracks: (bookID: string) => CLIENT.get<BookModelWithTracks>(`/audiobooks/books/${bookID}`),
  updateBook: ({ id, ...book }: Partial<PatchBook> & { id: string }) =>
    CLIENT.put<BookModel, Partial<PatchBook>>(`/audiobooks/books/${id}`, book),

  // Series
  fetchSeries: (offset: number, limit = 30) => CLIENT.get<SeriesModel[]>(`/audiobooks/series`, { limit, offset }),
  fetchSeriesSorting: (offset: number, limit: number) =>
    CLIENT.get<string[]>(`/audiobooks/series/sorting`, {
      limit,
      offset,
    }),
  fetchSeriesWithBooks: (seriesID: string) => CLIENT.get<SeriesModelWithBooks>(`/audiobooks/series/${seriesID}`),
  // TODO
  updateSeries: (data: any): any => null,

  // Misc
  rescan: () => CLIENT.post<null, object>(`/audiobooks/rescan`, {}),
}
