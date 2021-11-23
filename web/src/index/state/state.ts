import create from 'zustand';
import { environment } from '../../env';
import {
  AuthorModel,
  AuthorModelWithBooks,
  BookModel,
  BookModelWithTracks,
  SeriesModel,
  SeriesModelWithBooks
} from '../models/audiobook';
import { toIdRecord } from './helpers';

interface AudiobookState {
  authors: { [uuid: string]: AuthorModel | AuthorModelWithBooks; };
  books: { [uuid: string]: BookModel | BookModelWithTracks; };
  series: { [uuid: string]: SeriesModel | SeriesModelWithBooks; };
  getAuthors: () => void;
  getAuthorWithBooks: (id: string) => void;
  getBooks: () => void;
  getBookWithTracks: (id: string) => void;
  getSeries: () => void;
  getSeriesWithBooks: (id: string) => void;
}

export const userState = create<AudiobookState>(set => ({
  authors: {},
  books: {},
  series: {},
  getAuthors: async () => {
    const authors = await fetch(`${environment.apiURL}/audiobooks/authors?limit=1000&offset=0`).then(f => f.json()) as AuthorModel[];
    const authorMap = toIdRecord(authors);
    set({authors: authorMap});
  },
  getSeries: async () => {
    const series = await fetch(`${environment.apiURL}/audiobooks/series?limit=1000&offset=0`).then(f => f.json()) as SeriesModel[];
    const seriesMap = toIdRecord(series);
    set({series: seriesMap});
  },
  getBooks: async () => {
    const books = await fetch(`${environment.apiURL}/audiobooks/books?limit=1000&offset=0`).then(f => f.json()) as BookModel[];
    const bookMap = toIdRecord(books);
    set({books: bookMap});
  },
  getBookWithTracks: async (bookId: string) => {
    const book = await fetch(`${environment.apiURL}/audiobooks/books/${bookId}`).then(f => f.json()) as BookModelWithTracks;
    set((state) => ({
      books: {
        ...state.books,
        [bookId]: book
      }
    }));
  },
  getAuthorWithBooks: async (authorID: string) => {
    const author = await fetch(`${environment.apiURL}/audiobooks/authors/${authorID}`).then(f => f.json()) as AuthorModelWithBooks;
    set(state => ({
      authors: {
        ...state.authors,
        [authorID]: author,
      }
    }));
  },
  getSeriesWithBooks: async (seriesID: string) => {
    const author = await fetch(`${environment.apiURL}/audiobooks/series/${seriesID}`).then(f => f.json()) as SeriesModelWithBooks;
    set(state => ({
      series: {
        ...state.series,
        [seriesID]: author,
      }
    }));
  },
  removeAllBears: () => set({})
}));


