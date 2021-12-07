import { getClient, withBaseUrl, withCaching, withErrorHandler, withPersistence, withRenew } from '../Client';
import { environment } from '../env';
import {
  AuthorModel,
  AuthorModelWithBooks,
  BookModel,
  BookModelWithTracks,
  PatchBook,
  SeriesModel,
  SeriesModelWithBooks
} from './Audiobook';


const CLIENT = withErrorHandler(
  withPersistence(
    withRenew(
      withCaching(
        withBaseUrl(
          getClient(),
          environment.apiURL
        )
      )
    )
  ),
  console.warn
);

export const AudiobookClient = {
  fetchAuthors: (offset: number, limit = 30) =>
    CLIENT.get<AuthorModel[]>(`/audiobooks/authors?limit=${limit}&offset=${offset}`),
  fetchBooks: (offset: number, limit = 30) =>
    CLIENT.get<BookModel[]>(`/audiobooks/books?limit=${limit}&offset=${offset}`),
  fetchSeries: (offset: number, limit = 30) =>
    CLIENT.get<SeriesModel[]>(`/audiobooks/series?limit=${limit}&offset=${offset}`),
  fetchBookWithTracks: (bookID: string) =>
    CLIENT.get<BookModelWithTracks>(`/audiobooks/books/${bookID}`),
  fetchAuthorWithBooks: (authorID: string) =>
    CLIENT.get<AuthorModelWithBooks>(`/audiobooks/authors/${authorID}`),
  fetchSeriesWithBooks: (seriesID: string) =>
    CLIENT.get<SeriesModelWithBooks>(`/audiobooks/series/${seriesID}`),
  patchBook: ({id, ...book}: Partial<PatchBook> & { id: string }) =>
    CLIENT.patch<BookModel>(`/audiobooks/books/${id}`, book)
};
