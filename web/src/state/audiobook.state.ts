import { create } from "zustand"
import { combine } from "zustand/middleware"
import {
  Api,
  AuthorModel,
  BookModel,
  DetailedAuthorModel,
  DetailedBookModel,
  DetailedSeriesModel,
  LibraryModel,
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
  combine(INITIAL_STATE, (_, __, mutate) => ({
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
    // TODO Library
    // fetchLibraries: wrapFetch(mutate, "library", Api.listLibraries),
    // updateLibrary: wrapUpdate(mutate, "library", Api.updateLibrary),
    // fetchLibrarySorting: wrapSorting(mutate, "library", Api.listLibrarySorting),
    // fetchLibraryDetails: wrapDetails(mutate, "library", Api.getLibrary),
    // updateSortingOfLibrary: wrapSortingOf(mutate, "library", Api.getLibraryPosition),
    // clearLibrary: wrapClear(mutate, "library"),
  }))
)
