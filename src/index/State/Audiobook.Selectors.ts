import { AudiobookState } from "./Audiobook.State"

export const AudiobookSelectors = {
  // Books
  selectBooks: (state: AudiobookState) => state.bookSorting.map(id => state.bookMap[id]),
  selectBookCount: (state: AudiobookState) => state.bookTotal,
  selectBook: (id: string | undefined) => {
    return (state: AudiobookState) => {
      if (!(id! in state.bookMap)) return null
      return state.bookMap[id!]
    }
  },
  fetchBookDetails: (state: AudiobookState) => state.fetchBookDetails,
  fetchBooks: (state: AudiobookState) => state.fetchBooks,
  updateBook: (state: AudiobookState) => state.updateBook,
  fetchBooksSorting: (state: AudiobookState) => state.fetchBookSorting,

  // Authors
  selectAuthors: (state: AudiobookState) => state.authorSorting.map(id => state.authorMap[id]),
  selectAuthorCount: (state: AudiobookState) => state.authorTotal,
  updateAuthor: (state: AudiobookState) => state.updateAuthor,
  selectAuthor: (id: string | undefined) => {
    return (state: AudiobookState) => {
      if (!(id! in state.authorMap)) return null
      return state.authorMap[id!]
    }
  },
  fetchAuthorDetails: (state: AudiobookState) => state.fetchAuthorDetails,
  fetchAuthors: (state: AudiobookState) => state.fetchAuthors,
  fetchAuthorSorting: (state: AudiobookState) => state.fetchAuthorSorting,

  // Series
  selectSeriesList: (state: AudiobookState) => state.seriesSorting.map(id => state.seriesMap[id]),
  selectSeriesCount: (state: AudiobookState) => state.seriesTotal,
  updateSeries: (state: AudiobookState) => state.updateSeries,
  selectSeries: (id: string | undefined) => {
    return (state: AudiobookState) => {
      if (!(id! in state.seriesMap)) return null
      return state.seriesMap[id!]
    }
  },
  fetchSeriesDetails: (state: AudiobookState) => state.fetchSeriesDetails,
  fetchSeries: (state: AudiobookState) => state.fetchSeries,
  fetchSeriesSorting: (state: AudiobookState) => state.fetchSeriesSorting,
}
