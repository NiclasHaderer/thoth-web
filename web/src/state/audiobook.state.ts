import { combine } from "zustand/middleware"
import { shallow } from "zustand/shallow"
import { createWithEqualityFn } from "zustand/traditional"
import {
  Api,
  Author,
  AuthorDetailed,
  Book,
  BookDetailed,
  Library,
  PartialUpdateLibrary,
  Series,
  SeriesDetailed,
  UUID,
  UpdateLibrary,
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
      authorMap: Record<UUID, Author | AuthorDetailed>
      authorSorting: UUID[]
      authorTotal: number
      seriesMap: Record<UUID, Series | SeriesDetailed>
      seriesSorting: UUID[]
      seriesTotal: number
      bookMap: Record<UUID, Book | BookDetailed>
      bookSorting: UUID[]
      bookTotal: number
    }
  }
  libraryMap: Record<UUID, Library>
  librarySorting: UUID[]
  libraryTotal: number
}

const INITIAL_STATE = {
  content: {},
  libraryMap: {},
  librarySorting: [],
  libraryTotal: 0,
} as AudiobookState

export const useAudiobookState = createWithEqualityFn(
  combine(INITIAL_STATE, (_get, _set, mutate) => ({
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
      if (!libs.success) return libs
      mutate.setState(state => ({
        ...state,
        libraryMap: toIdRecord(libs.body),
      }))
      return libs
    },
    fetchLibrary: async (id: UUID) => {
      const lib = await Api.getLibrary({ libraryId: id })
      if (!lib.success) return lib
      mutate.setState(state => ({
        ...state,
        libraryMap: {
          ...state.libraryMap,
          [id]: lib.body,
        },
      }))
      return lib
    },
    updateLibrary: async (id: UUID, library: PartialUpdateLibrary) => {
      const res = await Api.updateLibrary({ libraryId: id }, library)
      if (!res.success) return res
      mutate.setState(state => ({
        ...state,
        libraryMap: {
          ...state.libraryMap,
          [id]: res.body,
        },
      }))
      return res
    },
    createLibrary: async (library: UpdateLibrary) => {
      const res = await Api.createLibrary(library)
      if (!res.success) return res
      mutate.setState(state => ({
        ...state,
        libraryMap: {
          ...state.libraryMap,
          [res.body.id]: res.body,
        },
      }))
      return res
    },
    deleteLibrary: async (id: UUID) => {
      const res = await Api.deleteLibrary({ libraryId: id })
      if (!res.success) return res
      mutate.setState(state => {
        const { [id]: _library, ...libraryMap } = state.libraryMap
        const { [id]: _content, ...content } = state.content
        return { ...state, libraryMap, content }
      })
      return res
    },
    clearLibrary: () => {
      mutate.setState(state => ({
        ...state,
        libraryMap: {},
      }))
    },
  })),
  shallow
)
