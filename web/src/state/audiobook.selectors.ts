import { AudiobookState } from "./audiobook.state"
import { UUID } from "@thoth/client"

export const AudiobookSelectors = {
  // Libraries
  selectedLibraryContent: (state: AudiobookState) => state.content[state.selectedLibraryId!],
  selectedLibrary: (state: AudiobookState) => state.libraryMap[state.selectedLibraryId!],
  selectedLibraryId: (state: AudiobookState) => state.selectedLibraryId,

  // Books
  selectBooks: (libraryId: UUID | undefined) => {
    return (state: AudiobookState) => {
      if (!(libraryId! in state.libraryMap)) return []
      return state.content[libraryId!].bookSorting.map(id => state.content[libraryId!].bookMap[id])
    }
  },
  selectBookCount: (libraryId: UUID | undefined) => {
    return (state: AudiobookState) => {
      if (!(libraryId! in state.libraryMap)) return 0
      return state.content[libraryId!].bookTotal
    }
  },
  selectBook: (libraryId: UUID | undefined, id: string | undefined) => {
    return (state: AudiobookState) => {
      if (!(libraryId! in state.libraryMap)) return null
      if (!(id! in state.content[libraryId!].bookMap)) return null
      return state.content[libraryId!].bookMap[id!]
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
      return state.content[libraryId!].authorSorting.map(id => state.content[libraryId!].authorMap[id])
    }
  },
  selectAuthorCount: (libraryId: UUID | undefined) => {
    return (state: AudiobookState) => {
      if (!(libraryId! in state.libraryMap)) return 0
      return state.content[libraryId!].authorTotal
    }
  },
  updateAuthor: (state: AudiobookState) => state.updateAuthor,
  selectAuthor: (libraryId: UUID | undefined, id: UUID | undefined) => {
    return (state: AudiobookState) => {
      if (!(libraryId! in state.libraryMap)) return null
      if (!(id! in state.content[libraryId!].authorMap)) return null
      return state.content[libraryId!].authorMap[id!]
    }
  },
  fetchAuthorDetails: (state: AudiobookState) => state.fetchAuthorDetails,
  fetchAuthors: (state: AudiobookState) => state.fetchAuthors,
  fetchAuthorSorting: (state: AudiobookState) => state.fetchAuthorSorting,

  // Series
  selectSeriesList: (libraryId: UUID | undefined) => {
    return (state: AudiobookState) => {
      if (!(libraryId! in state.libraryMap)) return []
      return state.content[libraryId!].seriesSorting.map(id => state.content[libraryId!].seriesMap[id])
    }
  },
  selectSeriesCount: (libraryId: UUID | undefined) => {
    return (state: AudiobookState) => {
      if (!(libraryId! in state.libraryMap)) return 0
      return state.content[libraryId!].seriesTotal
    }
  },
  updateSeries: (state: AudiobookState) => state.updateSeries,
  selectSeries: (libraryId: UUID | undefined, id: UUID | undefined) => {
    return (state: AudiobookState) => {
      if (!(libraryId! in state.libraryMap)) return null
      if (!(id! in state.content[libraryId!].seriesMap)) return null
      return state.content[libraryId!].seriesMap[id!]
    }
  },
  fetchSeriesDetails: (state: AudiobookState) => state.fetchSeriesDetails,
  fetchSeries: (state: AudiobookState) => state.fetchSeries,
  fetchSeriesSorting: (state: AudiobookState) => state.fetchSeriesSorting,
}
