import { create, Mutate, StoreApi, StoreMutatorIdentifier } from "zustand"
import { combine } from "zustand/middleware"
import { unstable_batchedUpdates } from "react-dom"
import { WebsocketConnection } from "../websocket"
import {
  AuthorModel,
  AuthorModelWithBooks,
  BookModel,
  BookModelWithTracks,
  ChangeEvent,
  PaginatedResponse,
  Position,
  SeriesModel,
  SeriesModelWithBooks,
} from "../models/api"
import { insertAtPosition, replaceRangeInList, toIdRecord } from "../utils"
import { AudiobookClient } from "../api/audiobook-client"
import { WrappedResponse } from "../client"

const wrapFetch = <K extends "author" | "series" | "book">(
  mutate: Mutate<StoreApi<INITIAL_STATE>, [StoreMutatorIdentifier, unknown][]>,
  key: K,
  fetchFunction: (
    offset: number,
    limit: number
  ) => Promise<WrappedResponse<PaginatedResponse<INITIAL_STATE[`${K}Map`][string]>>>
) => {
  return async (offset: number) => {
    const limit = 30
    const offsetCount = offset * limit
    const response = await fetchFunction(offsetCount, limit)
    if (!response.success) return
    mutate.setState(state => ({
      ...state,
      [`${key}Total`]: response.data.total,
      [`${key}Map`]: {
        ...state[`${key}Map`],
        ...toIdRecord(response.data.items),
      },
      [`${key}Sorting`]: replaceRangeInList(state[`${key}Sorting`], offsetCount, response.data.items),
    }))
  }
}

const wrapUpdate = <K extends "author" | "series" | "book", UPDATE_TYPE extends { id: string }>(
  mutate: Mutate<StoreApi<INITIAL_STATE>, [StoreMutatorIdentifier, unknown][]>,
  key: K,
  updateFunction: (data: UPDATE_TYPE) => Promise<WrappedResponse<INITIAL_STATE[`${K}Map`][string]>>
) => {
  return async (data: UPDATE_TYPE) => {
    const response = await updateFunction(data)
    if (!response.success) return
    mutate.setState(state => ({
      ...state,
      [`${key}Map`]: {
        ...state[`${key}Map`],
        [response.data.id]: {
          ...state[`${key}Map`][data.id],
          ...response.data,
        },
      },
    }))
  }
}

const wrapSorting = <K extends "author" | "series" | "book">(
  mutate: Mutate<StoreApi<INITIAL_STATE>, [StoreMutatorIdentifier, unknown][]>,
  key: K,
  sortingFunction: (offset: number, limit: number) => Promise<WrappedResponse<string[]>>
) => {
  return async (offset: number) => {
    const limit = 30
    const offsetCount = offset * limit
    const response = await sortingFunction(offsetCount, limit)
    if (!response.success) return

    mutate.setState(state => ({
      ...state,
      [`${key}Sorting`]: replaceRangeInList(state[`${key}Sorting`], offsetCount, response.data),
    }))
  }
}

const wrapDetails = <K extends "author" | "series" | "book">(
  mutate: Mutate<StoreApi<INITIAL_STATE>, [StoreMutatorIdentifier, unknown][]>,
  key: K,
  detailsFunction: (id: string) => Promise<WrappedResponse<INITIAL_STATE[`${K}Map`][string]>>
) => {
  return async (id: string) => {
    const response = await detailsFunction(id)
    if (!response.success) return
    mutate.setState(state => ({
      ...state,
      [`${key}Map`]: {
        ...state[`${key}Map`],
        [response.data.id]: response.data,
      },
    }))
  }
}

const wrapClear = <K extends "author" | "series" | "book">(
  mutate: Mutate<StoreApi<INITIAL_STATE>, [StoreMutatorIdentifier, unknown][]>,
  key: K
) => {
  return () => {
    mutate.setState(state => ({
      ...state,
      [`${key}Map`]: {},
      [`${key}Sorting`]: [],
      [`${key}Total`]: 0,
    }))
  }
}

const wrapSortingOf = <K extends "author" | "series" | "book">(
  mutate: Mutate<StoreApi<INITIAL_STATE>, [StoreMutatorIdentifier, unknown][]>,
  key: K,
  sortingFunction: (id: string) => Promise<WrappedResponse<Position>>
) => {
  return async (id: string) => {
    const response = await sortingFunction(id)
    if (!response.success) return
    mutate.setState(state => ({
      ...state,
      [`${key}Sorting`]: insertAtPosition(state[`${key}Sorting`], id, response.data.sortIndex),
    }))
  }
}

const wrapWs = <K extends "author" | "series" | "book">(
  mutate: Mutate<StoreApi<INITIAL_STATE>, [StoreMutatorIdentifier, unknown][]>,
  key: K,
  updateDetails: (id: string) => Promise<void>,
  updateSorting: (id: string) => Promise<void>,
  ws?: WebsocketConnection<ChangeEvent>
): undefined => {
  if (!ws) return undefined

  const handleRemove = (id: string) => {
    const state = mutate.getState()
    if (!(id in state[`${key}Map`]) && !state[`${key}Sorting`].includes(id)) return

    const newMappingState = { ...state[`${key}Map`] }
    delete newMappingState[id]

    mutate.setState(state => ({
      ...state,
      [`${key}Mapping`]: newMappingState,
      [`${key}Sorting`]: state[`${key}Sorting`].filter(i => i !== id),
    }))
  }

  const handleUpsert = async (id: string) => {
    await updateDetails(id)
    await updateSorting(id)
  }

  ws.onMessage(m =>
    unstable_batchedUpdates(async () => {
      if (m.type === "Removed") {
        handleRemove(m.id)
      } else {
        await handleUpsert(m.id)
      }
    })
  )
  return undefined
}

const INITIAL_STATE = {
  authorMap: {} as Record<string, AuthorModel | AuthorModelWithBooks>,
  authorSorting: [] as string[],
  authorTotal: 0,
  seriesMap: {} as Record<string, SeriesModel | SeriesModelWithBooks>,
  seriesSorting: [] as string[],
  seriesTotal: 0,
  bookMap: {} as Record<string, BookModel | BookModelWithTracks>,
  bookSorting: [] as string[],
  bookTotal: 0,
} as const
type INITIAL_STATE = typeof INITIAL_STATE

export const useAudiobookState = create(
  combine(INITIAL_STATE, (_, __, mutate) => ({
    // Author
    fetchAuthors: wrapFetch(mutate, "author", AudiobookClient.fetchAuthors),
    updateAuthor: wrapUpdate(mutate, "author", AudiobookClient.updateAuthor),
    fetchAuthorSorting: wrapSorting(mutate, "author", AudiobookClient.fetchAuthorSorting),
    fetchAuthorDetails: wrapDetails(mutate, "author", AudiobookClient.fetchAuthorWithBooks),
    updateSortingOf: wrapSortingOf(mutate, "author", AudiobookClient.fetchAuthorPosition),
    clearAuthor: wrapClear(mutate, "author"),
    authorWs: wrapWs(
      mutate,
      "author",
      wrapDetails(mutate, "author", AudiobookClient.fetchAuthorWithBooks),
      wrapSortingOf(mutate, "author", AudiobookClient.fetchAuthorPosition),
      undefined
    ),
    // Series
    fetchSeries: wrapFetch(mutate, "series", AudiobookClient.fetchSeries),
    updateSeries: wrapUpdate(mutate, "series", AudiobookClient.updateSeries),
    fetchSeriesSorting: wrapSorting(mutate, "series", AudiobookClient.fetchSeriesSorting),
    fetchSeriesDetails: wrapDetails(mutate, "series", AudiobookClient.fetchSeriesWithBooks),
    updateSortingOfSeries: wrapSortingOf(mutate, "series", AudiobookClient.fetchSeriesPosition),
    clearSeries: wrapClear(mutate, "series"),
    seriesWs: wrapWs(
      mutate,
      "series",
      wrapDetails(mutate, "series", AudiobookClient.fetchSeriesWithBooks),
      wrapSortingOf(mutate, "series", AudiobookClient.fetchSeriesPosition),
      undefined
    ),
    // Book
    fetchBooks: wrapFetch(mutate, "book", AudiobookClient.fetchBooks),
    updateBook: wrapUpdate(mutate, "book", AudiobookClient.updateBook),
    fetchBookSorting: wrapSorting(mutate, "book", AudiobookClient.fetchBookSorting),
    fetchBookDetails: wrapDetails(mutate, "book", AudiobookClient.fetchBookWithTracks),
    updateSortingOfBook: wrapSortingOf(mutate, "book", AudiobookClient.fetchBookPosition),
    clearBook: wrapClear(mutate, "book"),
    bookWs: wrapWs(
      mutate,
      "book",
      wrapDetails(mutate, "book", AudiobookClient.fetchBookWithTracks),
      wrapSortingOf(mutate, "book", AudiobookClient.fetchBookPosition),
      undefined
    ),
  }))
)

export type AudiobookState = ReturnType<(typeof useAudiobookState)["getState"]>
