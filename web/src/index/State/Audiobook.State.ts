import create from 'zustand';
import { getClient, withBaseUrl, withCaching, withErrorHandler, withPersistence, withRenew } from '../Client';
import { environment } from '../env';
import { replaceRangeInList, toIdRecord } from '../helpers';
import {
  AuthorModel,
  AuthorModelWithBooks,
  BookModel,
  BookModelWithTracks,
  SeriesModel,
  SeriesModelWithBooks
} from '../Models/Audiobook';

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

export interface AudiobookState {
  authors: Record<string, (AuthorModel | AuthorModelWithBooks)>;
  authorSorting: string[],
  books: Record<string, (BookModel | BookModelWithTracks)>;
  bookSorting: string[],
  series: Record<string, (SeriesModel | SeriesModelWithBooks)>;
  seriesSorting: string[],
  fetchAuthors: (offset: number) => void;
  fetchAuthorWithBooks: (id: string) => void;
  fetchBooks: (offset: number) => void;
  fetchBookWithTracks: (id: string) => void;
  fetchSeries: (offset: number) => void;
  fetchSeriesWithBooks: (id: string) => void;
}

export const useAudiobookState = create<AudiobookState>((set) => ({
  authorSorting: [],
  authors: {},
  bookSorting: [],
  books: {},
  seriesSorting: [],
  series: {},
  fetchAuthors: async (offset: number, limit: number = 30) => {
    const authors = await CLIENT.get<AuthorModel[]>(`/audiobooks/authors?limit=${limit}&offset=${offset}`);
    set(state => ({
      authors: {
        ...state.authors,
        ...toIdRecord(authors)
      },
      authorSorting: replaceRangeInList(state.authorSorting, offset, authors.map(a => a.id))
    }));
  },
  fetchSeries: async (offset: number, limit: number = 30) => {
    const series = await CLIENT.get<SeriesModel[]>(`/audiobooks/series?limit=${limit}&offset=${offset}`);
    set(state => ({
      series: {
        ...state.series,
        ...toIdRecord(series)
      },
      seriesSorting: replaceRangeInList(state.seriesSorting, offset, series.map(s => s.id))
    }));
  },
  fetchBooks: async (offset: number, limit: number = 30) => {
    const books = await CLIENT.get<BookModel[]>(`/audiobooks/books?limit=${limit}&offset=${offset}`);
    set(state => ({
      books: {
        ...state.books,
        ...toIdRecord(books)
      },
      bookSorting: replaceRangeInList(state.bookSorting, offset, books.map(b => b.id))
    }));
  },
  fetchBookWithTracks: async (bookId: string) => {
    const book = await fetch(`${environment.apiURL}/audiobooks/books/${bookId}`).then(f => f.json()) as BookModelWithTracks;
    set((state) => ({
      books: {
        ...state.books,
        [book.id]: book
      }
    }));
  },
  fetchAuthorWithBooks: async (authorID: string) => {
    const author = await fetch(`${environment.apiURL}/audiobooks/authors/${authorID}`).then(f => f.json()) as AuthorModelWithBooks;
    set((state) => ({
      authors: {
        ...state.authors,
        [author.id]: author
      }
    }));
  },
  fetchSeriesWithBooks: async (seriesID: string) => {
    const series = await fetch(`${environment.apiURL}/audiobooks/series/${seriesID}`).then(f => f.json()) as SeriesModelWithBooks;
    set((state) => ({
      series: {
        ...state.series,
        [series.id]: series
      }
    }));
  },
}));


