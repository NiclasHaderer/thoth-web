import { AudiobookState } from "./audiobook.state"
import { UUID } from "@thoth/models/api-models"

export const AudiobookSelectors = {
  // Libraries
  selectedLibrary: (state: AudiobookState) => state[state.selectedLibraryId!],
  selectedLibraryId: (state: AudiobookState) => state.selectedLibraryId,

  // Books
  selectBooks: (libraryId: UUID | undefined) => {
    return (state: AudiobookState) => {
      if (!(libraryId! in state.libraryMap)) return []
      return state[libraryId!].bookSorting.map(id => state[libraryId!].bookMap[id])
    }
  },
  selectBookCount: (libraryId: UUID | undefined) => {
    return (state: AudiobookState) => {
      if (!(libraryId! in state.libraryMap)) return 0
      return state[libraryId!].bookTotal
    }
  },
  selectBook: (libraryId: UUID | undefined, id: string | undefined) => {
    return (state: AudiobookState) => {
      if (!(libraryId! in state.libraryMap)) return null
      if (!(id! in state[libraryId!].bookMap)) return null
      return state[libraryId!].bookMap[id!]
    }
  },
  fetchBookDetails: (state: AudiobookState) => state.fetchBookDetails,
  fetchBooks: (state: AudiobookState) => state.fetchBooks,
  updateBook: (state: AudiobookState) => state.updateBook,
  fetchBooksSorting: (state: AudiobookState) => state.fetchBookSorting,

  // Authors
  selectAuthors: (libraryId: UUID | undefined) => {
    return (state: AudiobookState) => {
      if (!(libraryId! in state.libraryMap)) return []
      return state[libraryId!].authorSorting.map(id => state[libraryId!].authorMap[id])
    }
  },
  selectAuthorCount: (libraryId: UUID | undefined) => {
    return (state: AudiobookState) => {
      if (!(libraryId! in state.libraryMap)) return 0
      return state[libraryId!].authorTotal
    }
  },
  updateAuthor: (state: AudiobookState) => state.updateAuthor,
  selectAuthor: (libraryId: UUID | undefined, id: UUID | undefined) => {
    return (state: AudiobookState) => {
      if (!(libraryId! in state.libraryMap)) return null
      if (!(id! in state[libraryId!].authorMap)) return null
      return state[libraryId!].authorMap[id!]
    }
  },
  fetchAuthorDetails: (state: AudiobookState) => state.fetchAuthorDetails,
  fetchAuthors: (state: AudiobookState) => state.fetchAuthors,
  fetchAuthorSorting: (state: AudiobookState) => state.fetchAuthorSorting,

  // Series
  selectSeriesList: (libraryId: UUID | undefined) => {
    return (state: AudiobookState) => {
      if (!(libraryId! in state.libraryMap)) return []
      return state[libraryId!].seriesSorting.map(id => state[libraryId!].seriesMap[id])
    }
  },
  selectSeriesCount: (libraryId: UUID | undefined) => {
    return (state: AudiobookState) => {
      if (!(libraryId! in state.libraryMap)) return 0
      return state[libraryId!].seriesTotal
    }
  },
  updateSeries: (state: AudiobookState) => state.updateSeries,
  selectSeries: (libraryId: UUID | undefined, id: UUID | undefined) => {
    return (state: AudiobookState) => {
      if (!(libraryId! in state.libraryMap)) return null
      if (!(id! in state[libraryId!].seriesMap)) return null
      return state[libraryId!].seriesMap[id!]
    }
  },
  fetchSeriesDetails: (state: AudiobookState) => state.fetchSeriesDetails,
  fetchSeries: (state: AudiobookState) => state.fetchSeries,
  fetchSeriesSorting: (state: AudiobookState) => state.fetchSeriesSorting,
}
