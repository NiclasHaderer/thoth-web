import create from 'zustand';
import {
  AuthorModel,
  AuthorModelWithBooks,
  BookModel,
  BookModelWithTracks,
  PatchBook,
  SeriesModel,
  SeriesModelWithBooks
} from '../API/Audiobook';
import { AudiobookClient } from '../API/AudiobookClient';
import { replaceRangeInList, toIdRecord } from '../helpers';

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
  patchBook: (book: Partial<PatchBook> & { id: string }) => void;
}

export const useAudiobookState = create<AudiobookState>((set) => ({
  authorSorting: [],
  authors: {},
  bookSorting: [],
  books: {},
  seriesSorting: [],
  series: {},
  fetchAuthors: async (offset: number, limit: number = 30) => {
    const authors = await AudiobookClient.fetchAuthors(offset, limit);
    set(state => ({
      authors: {
        ...state.authors,
        ...toIdRecord(authors)
      },
      authorSorting: replaceRangeInList(state.authorSorting, offset * limit, authors.map(a => a.id))
    }));
  },
  fetchSeries: async (offset: number, limit: number = 30) => {
    const series = await AudiobookClient.fetchSeries(offset, limit);
    set(state => ({
      series: {
        ...state.series,
        ...toIdRecord(series)
      },
      seriesSorting: replaceRangeInList(state.seriesSorting, offset, series.map(s => s.id))
    }));
  },
  fetchBooks: async (offset: number, limit: number = 30) => {
    const books = await AudiobookClient.fetchBooks(offset, limit);
    set(state => ({
      books: {
        ...state.books,
        ...toIdRecord(books)
      },
      bookSorting: replaceRangeInList(state.bookSorting, offset * limit, books.map(b => b.id))
    }));
  },
  fetchBookWithTracks: async (bookID: string) => {
    const book = await AudiobookClient.fetchBookWithTracks(bookID);
    set((state) => ({
      books: {
        ...state.books,
        [book.id]: book
      }
    }));
  },
  fetchAuthorWithBooks: async (authorID: string) => {
    const author = await AudiobookClient.fetchAuthorWithBooks(authorID);
    set((state) => ({
      authors: {
        ...state.authors,
        [author.id]: author
      }
    }));
  },
  fetchSeriesWithBooks: async (seriesID: string) => {
    const series = await AudiobookClient.fetchSeriesWithBooks(seriesID);
    set((state) => ({
      series: {
        ...state.series,
        [series.id]: series
      }
    }));
  },
  patchBook: async (book: Partial<PatchBook> & { id: string }) => {
    const returnBook = await AudiobookClient.patchBook(book);
    set((state) => ({
      books: {
        ...state.books,
        [book.id]: {
          ...state.books[book.id] ? state.books[book.id] : {},
          ...returnBook
        }
      }
    }));
  },
}));


