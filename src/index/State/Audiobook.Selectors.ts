import { AudiobookState } from './Audiobook.State';

export const AudiobookSelectors = {
  // Books
  selectBooks: (state: AudiobookState) => state.BooksSorting.map(id => state.BooksMapping[id]),
  selectBook: (id: string | undefined) => {
    return (state: AudiobookState) => {
      if (!(id! in state.BooksMapping)) return null;
      return state.BooksMapping[id!];
    };
  },
  fetchBookDetails: (state: AudiobookState) => state.fetchBooksDetails,
  fetchBooks: (state: AudiobookState) => state.fetchBooks,
  updateBook: (state: AudiobookState) => state.updateBooks,
  fetchBooksSorting: (state: AudiobookState) => state.fetchBooksSorting,

  // Authors
  selectAuthors: (state: AudiobookState) => state.AuthorsSorting.map(id => state.AuthorsMapping[id]),
  selectAuthor: (id: string | undefined) => {
    return (state: AudiobookState) => {
      if (!(id! in state.AuthorsMapping)) return null;
      return state.AuthorsMapping[id!];
    };
  },
  fetchAuthorDetails: (state: AudiobookState) => state.fetchAuthorsDetails,
  fetchAuthors: (state: AudiobookState) => state.fetchAuthors,
  fetchAuthorSorting: (state: AudiobookState) => state.fetchAuthorsSorting,

  // Series
  selectSeriesList: (state: AudiobookState) => state.SeriesSorting.map(id => state.SeriesMapping[id]),
  selectSeries: (id: string | undefined) => {
    return (state: AudiobookState) => {
      if (!(id! in state.SeriesMapping)) return null;
      return state.SeriesMapping[id!];
    };
  },
  fetchSeriesDetails: (state: AudiobookState) => state.fetchSeriesDetails,
  fetchSeries: (state: AudiobookState) => state.fetchSeries,
  fetchSeriesSorting: (state: AudiobookState) => state.fetchSeriesSorting,
};
