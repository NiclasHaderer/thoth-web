import { create } from "zustand"
import { combine } from "zustand/middleware"
import {
  Api,
  AuthorModel,
  BookModel,
  DetailedAuthorModel,
  DetailedBookModel,
  DetailedSeriesModel,
  LibraryApiModel,
  LibraryModel,
  PartialLibraryApiModel,
  SeriesModel,
  UUID,
} from "@thoth/client"
import {
  wrapClear,
  wrapDetails,
  wrapFetch,
  wrapSorting,
  wrapSortingOf,
  wrapUpdate,
  wrapWs,
} from "@thoth/state/audiobook.utils"
import { toIdRecord } from "@thoth/utils/utils"

export type AudiobookState = {
  content: {
    [libraryId: UUID]: {
      authorMap: Record<string, AuthorModel | DetailedAuthorModel>
      authorSorting: string[]
      authorTotal: number
      seriesMap: Record<string, SeriesModel | DetailedSeriesModel>
      seriesSorting: string[]
      seriesTotal: number
      bookMap: Record<string, BookModel | DetailedBookModel>
      bookSorting: string[]
      bookTotal: number
    }
  }
  libraryMap: Record<string, LibraryModel>
  librarySorting: string[]
  libraryTotal: number
  selectedLibraryId?: UUID
}

const INITIAL_STATE = {
  selectedLibraryId: undefined as UUID | undefined,
  content: {},
  libraryMap: {},
  librarySorting: [],
  libraryTotal: 0,
} as AudiobookState

export const useAudiobookState = create(
  combine(INITIAL_STATE, (get, set, mutate) => ({
    // Author
    fetchAuthors: wrapFetch(mutate, "author", Api.listAuthors),
    updateAuthor: wrapUpdate(mutate, "author", Api.updateAuthor),
    fetchAuthorSorting: wrapSorting(mutate, "author", Api.listAuthorSorting),
    fetchAuthorDetails: wrapDetails(mutate, "author", Api.getAuthor),
    updateSortingOf: wrapSortingOf(mutate, "author", Api.getAuthorPosition),
    clearAuthor: wrapClear(mutate, "author"),
    authorWs: wrapWs(
      mutate,
      "author",
      wrapDetails(mutate, "author", Api.getAuthor),
      wrapSortingOf(mutate, "author", Api.getAuthorPosition),
      undefined
    ),
    // Series
    fetchSeries: wrapFetch(mutate, "series", Api.listSeries),
    updateSeries: wrapUpdate(mutate, "series", Api.updateSeries),
    fetchSeriesSorting: wrapSorting(mutate, "series", Api.listSeriesSorting),
    fetchSeriesDetails: wrapDetails(mutate, "series", Api.getSeries),
    updateSortingOfSeries: wrapSortingOf(mutate, "series", Api.getSeriesPosition),
    clearSeries: wrapClear(mutate, "series"),
    seriesWs: wrapWs(
      mutate,
      "series",
      wrapDetails(mutate, "series", Api.getSeries),
      wrapSortingOf(mutate, "series", Api.getSeriesPosition),
      undefined
    ),
    // Book
    fetchBooks: wrapFetch(mutate, "book", Api.listBooks),
    updateBook: wrapUpdate(mutate, "book", Api.updateBook),
    fetchBookSorting: wrapSorting(mutate, "book", Api.listBookSorting),
    fetchBookDetails: wrapDetails(mutate, "book", Api.getBook),
    updateSortingOfBook: wrapSortingOf(mutate, "book", Api.getBookPosition),
    clearBook: wrapClear(mutate, "book"),
    bookWs: wrapWs(
      mutate,
      "book",
      wrapDetails(mutate, "book", Api.getBook),
      wrapSortingOf(mutate, "book", Api.getBookPosition),
      undefined
    ),
    fetchLibraries: async () => {
      const libs = await Api.listLibraries()
      if (!libs.success) return
      mutate.setState(state => ({
        ...state,
        libraryMap: toIdRecord(libs.body),
      }))
    },
    updateLibrary: async (id: UUID, library: PartialLibraryApiModel) => {
      const res = await Api.updateLibrary({ libraryId: id }, library)
      if (!res.success) return
      mutate.setState(state => ({
        ...state,
        libraryMap: {
          ...state.libraryMap,
          [id]: res.body,
        },
      }))
    },
    createLibrary: async (library: LibraryApiModel) => {
      const res = await Api.createLibrary(library)
      if (!res.success) return
      mutate.setState(state => ({
        ...state,
        libraryMap: {
          ...state.libraryMap,
          [res.body.id]: res.body,
        },
      }))
    },
    clearLibrary: () => {
      mutate.setState(state => ({
        ...state,
        libraryMap: {},
      }))
    },
  }))
)
;(() => {
  // If on server, do not initialize state
  if (typeof window === "undefined") return
  const extractLibId = /libraries\/([a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12})\//

  // Subscribe to url changes using the history API
  // and update the selectedLibraryId accordingly
  const updateSelectedLibraryId = () => {
    const path = window.location.pathname
    const libraryId = extractLibId.exec(path)?.[1]
    if (libraryId) {
      useAudiobookState.setState({ selectedLibraryId: libraryId })
    } else {
      useAudiobookState.setState({ selectedLibraryId: undefined })
    }
  }
  window.addEventListener("popstate", updateSelectedLibraryId)
  window.addEventListener("pushstate", updateSelectedLibraryId)
  window.addEventListener("replacestate", updateSelectedLibraryId)
  updateSelectedLibraryId()
})()
