import create from 'zustand';
import { environment } from '../env';
import { replaceInList, unique } from '../helpers';
import {
  AuthorModel,
  AuthorModelWithBooks,
  BookModel,
  BookModelWithTracks,
  SeriesModel,
  SeriesModelWithBooks
} from '../Models/Audiobook';

interface AudiobookState {
  authors: (AuthorModel | AuthorModelWithBooks)[];
  books: (BookModel | BookModelWithTracks)[];
  series: (SeriesModel | SeriesModelWithBooks)[];
  fetchAuthors: (offset: number) => void;
  fetchAuthorWithBooks: (id: string) => void;
  fetchBooks: (offset: number) => void;
  fetchBookWithTracks: (id: string) => void;
  fetchSeries: (offset: number) => void;
  fetchSeriesWithBooks: (id: string) => void;
}

export const useAudiobookState = create<AudiobookState>((set) => ({
  authors: [],
  books: [],
  series: [],
  fetchAuthors: async (offset: number) => {
    const authors = await fetch(`${environment.apiURL}/audiobooks/authors?limit=30&offset=${offset}`).then(f => f.json()) as AuthorModel[];
    set(state => ({authors: unique([...state.authors, ...authors], i => i.id)}));
  },
  fetchSeries: async (offset: number) => {
    const series = await fetch(`${environment.apiURL}/audiobooks/series?limit=30&offset=${offset}`).then(f => f.json()) as SeriesModel[];
    set(state => ({series: unique([...state.series, ...series], i => i.id)}));
  },
  fetchBooks: async (offset: number) => {
    const books = await fetch(`${environment.apiURL}/audiobooks/books?limit=30&offset=${offset}`).then(f => f.json()) as BookModel[];
    set(state => ({books: unique([...state.books, ...books], i => i.id)}));
  },
  fetchBookWithTracks: async (bookId: string) => {
    const book = await fetch(`${environment.apiURL}/audiobooks/books/${bookId}`).then(f => f.json()) as BookModelWithTracks;
    set((state) => ({
      books: replaceInList(state.books, book)
    }));
  },
  fetchAuthorWithBooks: async (authorID: string) => {
    const author = await fetch(`${environment.apiURL}/audiobooks/authors/${authorID}`).then(f => f.json()) as AuthorModelWithBooks;
    set(state => ({
      authors: replaceInList(state.authors, author)
    }));
  },
  fetchSeriesWithBooks: async (seriesID: string) => {
    const series = await fetch(`${environment.apiURL}/audiobooks/series/${seriesID}`).then(f => f.json()) as SeriesModelWithBooks;
    set(state => ({
      series: replaceInList(state.series, series)
    }));
  },
}));


