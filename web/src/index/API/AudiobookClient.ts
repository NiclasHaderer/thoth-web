import { getClient, withBaseUrl, withCaching, withErrorHandler } from '../Client';
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


const CLIENT = (() => {
  let client = withErrorHandler(
    withBaseUrl(
      getClient(),
      environment.apiURL
    )
  );
  if (environment.production) {
    client = withCaching(client);
  }
  return client;
})();

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
  updateBook: ({id, ...book}: Partial<PatchBook> & { id: string }) =>
    CLIENT.put<BookModel>(`/audiobooks/books/${id}`, book),
  rescan: () => CLIENT.post<null>(`/audiobooks/rescan`, {})
};
