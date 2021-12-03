import { AudiobookState } from './Audiobook.State';

export const selectBooks = (state: AudiobookState) => {
  return state.bookSorting.map(id => state.books[id]);
};
export const selectBook = (id: string | undefined) => {
  return (state: AudiobookState) => {
    if (!(id! in state.books)) return null;
    return state.books[id!];
  };
};
export const selectAuthors = (state: AudiobookState) => state.authorSorting.map(id => state.authors[id]);
export const selectAuthor = (id: string | undefined) => {
  return (state: AudiobookState) => {
    if (!(id! in state.authors)) return null;
    return state.authors[id!];
  };
};
export const selectSeriesList = (state: AudiobookState) => state.seriesSorting.map(id => state.series[id]);
export const selectSeries = (id: string | undefined) => {
  return (state: AudiobookState) => {
    if (!(id! in state.series)) return null;
    return state.series[id!];
  };
};
