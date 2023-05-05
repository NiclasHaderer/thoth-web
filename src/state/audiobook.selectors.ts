import { AudiobookState } from "./audiobook.state"
import { UUID } from "@thoth/client"

export const AudiobookSelectors = {
  // Libraries
  selectedLibraryContent: (state: AudiobookState) => state.content[state.selectedLibraryId!],
  selectedLibrary: (state: AudiobookState) => state.libraryMap[state.selectedLibraryId!],
  selectedLibraryId: (state: AudiobookState) => state.selectedLibraryId,
  libraries: (state: AudiobookState) => Object.values(state.libraryMap),

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
  selectAuthor: (libraryId: UUID | undefined, id: UUID | undefined) => {
    return (state: AudiobookState) => {
      if (!(libraryId! in state.libraryMap)) return null
      if (!(id! in state.content[libraryId!].authorMap)) return null
      return state.content[libraryId!].authorMap[id!]
    }
  },

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
  selectSeries: (libraryId: UUID | undefined, id: UUID | undefined) => {
    return (state: AudiobookState) => {
      if (!(libraryId! in state.libraryMap)) return null
      if (!(id! in state.content[libraryId!].seriesMap)) return null
      return state.content[libraryId!].seriesMap[id!]
    }
  },
}
