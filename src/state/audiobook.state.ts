import { create, Mutate, StoreApi, StoreMutatorIdentifier } from "zustand"
import { combine } from "zustand/middleware"
import { unstable_batchedUpdates } from "react-dom"
import { insertAtPosition, replaceRangeInList, toIdRecord } from "../utils/utils"
import {
  ApiResponse,
  AuthorModel,
  BookModel,
  DetailedAuthorModel,
  DetailedBookModel,
  DetailedSeriesModel,
  LibraryModel,
  PaginatedResponse,
  Position,
  SeriesModel,
  UUID,
} from "@thoth/client"
import { WebsocketConnection } from "@thoth/websocket"
import { ChangeEvent } from "@thoth/models/ws"
import { Api } from "@thoth/client"

const wrapFetch = <K extends "author" | "series" | "book">(
  mutate: Mutate<StoreApi<INITIAL_STATE>, [StoreMutatorIdentifier, unknown][]>,
  key: K,
  fetchFunction: (
    libraryId: UUID,
    offset?: number,
    limit?: number
  ) => Promise<ApiResponse<PaginatedResponse<INITIAL_STATE["content"][UUID][`${K}Map`][string]>>>
) => {
  return async (libraryId: UUID, offset: number) => {
    const limit = 30
    const offsetCount = offset * limit
    const response = await fetchFunction(libraryId, offsetCount, limit)
    if (!response.success) return
    mutate.setState(state => ({
      ...state,
      content: {
        ...state.content,
        [libraryId]: {
          ...state.content[libraryId],
          [`${key}Total`]: response.body.total,
          [`${key}Map`]: {
            ...state.content[libraryId][`${key}Map`],
            ...toIdRecord(response.body.items),
          },
          [`${key}Sorting`]: replaceRangeInList(
            state.content[libraryId][`${key}Sorting`],
            offsetCount,
            response.body.items
          ),
        },
      },
    }))
  }
}

const wrapUpdate = <K extends "author" | "series" | "book", UPDATE_TYPE>(
  mutate: Mutate<StoreApi<INITIAL_STATE>, [StoreMutatorIdentifier, unknown][]>,
  key: K,
  updateFunction: (
    libraryId: UUID,
    authorId: UUID,
    data: UPDATE_TYPE
  ) => Promise<ApiResponse<INITIAL_STATE["content"][UUID][`${K}Map`][string]>>
) => {
  return async (libraryId: UUID, authorId: UUID, data: UPDATE_TYPE) => {
    const response = await updateFunction(libraryId, authorId, data)
    if (!response.success) return
    mutate.setState(state => ({
      ...state,
      content: {
        ...state.content,
        [libraryId]: {
          ...state.content[libraryId],
          [`${key}Map`]: {
            ...state.content[libraryId][`${key}Map`],
            [response.body.id]: {
              ...state.content[libraryId][`${key}Map`][authorId],
              ...response.body,
            },
          },
        },
      },
    }))
  }
}

const wrapSorting = <K extends "author" | "series" | "book">(
  mutate: Mutate<StoreApi<INITIAL_STATE>, [StoreMutatorIdentifier, unknown][]>,
  key: K,
  sortingFunction: (libraryId: UUID, offset: number, limit: number) => Promise<ApiResponse<string[]>>
) => {
  return async (libraryId: UUID, offset: number) => {
    const limit = 30
    const offsetCount = offset * limit
    const response = await sortingFunction(libraryId, offsetCount, limit)
    if (!response.success) return

    mutate.setState(state => ({
      ...state,
      content: {
        ...state.content,

        [libraryId]: {
          ...state.content[libraryId],
          [`${key}Sorting`]: replaceRangeInList(state.content[libraryId][`${key}Sorting`], offsetCount, response.body),
        },
      },
    }))
  }
}

const wrapDetails = <K extends "author" | "series" | "book">(
  mutate: Mutate<StoreApi<INITIAL_STATE>, [StoreMutatorIdentifier, unknown][]>,
  key: K,
  detailsFunction: (
    libraryId: UUID,
    id: UUID
  ) => Promise<ApiResponse<INITIAL_STATE["content"][UUID][`${K}Map`][string]>>
) => {
  return async (libraryId: UUID, id: UUID) => {
    const response = await detailsFunction(libraryId, id)
    if (!response.success) return
    mutate.setState(state => ({
      ...state,
      content: {
        ...state.content,
        [libraryId]: {
          ...state.content[libraryId],
          [`${key}Map`]: {
            ...state.content[libraryId][`${key}Map`],
            [id]: response.body,
          },
        },
      },
    }))
  }
}

const wrapClear = <K extends "author" | "series" | "book">(
  mutate: Mutate<StoreApi<INITIAL_STATE>, [StoreMutatorIdentifier, unknown][]>,
  key: K
) => {
  return (libraryId: UUID) => {
    mutate.setState(state => ({
      ...state,
      content: {
        ...state.content,
        [libraryId]: {
          ...state.content[libraryId],
          [`${key}Map`]: {},
          [`${key}Sorting`]: [],
          [`${key}Total`]: 0,
        },
      },
    }))
  }
}

const wrapSortingOf = <K extends "author" | "series" | "book">(
  mutate: Mutate<StoreApi<INITIAL_STATE>, [StoreMutatorIdentifier, unknown][]>,
  key: K,
  sortingFunction: (libraryId: UUID, id: UUID) => Promise<ApiResponse<Position>>
) => {
  return async (libraryId: UUID, id: UUID) => {
    const response = await sortingFunction(libraryId, id)
    if (!response.success) return
    mutate.setState(state => ({
      ...state,
      content: {
        ...state.content,
        [libraryId]: {
          ...state.content[libraryId],
          [`${key}Sorting`]: insertAtPosition(state.content[libraryId][`${key}Sorting`], id, response.body.sortIndex),
        },
      },
    }))
  }
}

const wrapWs = <K extends "author" | "series" | "book">(
  mutate: Mutate<StoreApi<INITIAL_STATE>, [StoreMutatorIdentifier, unknown][]>,
  key: K,
  updateDetails: (libraryId: UUID, id: UUID) => Promise<void>,
  updateSorting: (libraryId: UUID, id: UUID) => Promise<void>,
  ws?: WebsocketConnection<ChangeEvent>
): undefined => {
  if (!ws) return undefined

  const handleRemove = (libraryId: UUID, id: UUID) => {
    const state = mutate.getState()
    if (!(id in state.content[libraryId][`${key}Map`]) && !state.content[libraryId][`${key}Sorting`].includes(id))
      return

    const newMappingState = { ...state.content[libraryId][`${key}Map`] }
    delete newMappingState[id]

    mutate.setState(state => ({
      ...state,
      content: {
        ...state.content,
        [libraryId]: {
          ...state.content[libraryId],
          [`${key}Mapping`]: newMappingState,
          [`${key}Sorting`]: state.content[libraryId][`${key}Sorting`].filter(i => i !== id),
        },
      },
    }))
  }

  const handleUpsert = async (libraryId: UUID, id: UUID) => {
    await updateDetails(libraryId, id)
    await updateSorting(libraryId, id)
  }

  ws.onMessage(m =>
    unstable_batchedUpdates(async () => {
      if (m.type === "Removed") {
        handleRemove(m.libraryId, m.id)
      } else {
        await handleUpsert(m.libraryId, m.id)
      }
    })
  )
  return undefined
}

const INITIAL_STATE = {
  libraryMap: {} as Record<UUID, LibraryModel>,
  selectedLibraryId: undefined as UUID | undefined,
} as {
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
  libraryMap: Record<UUID, LibraryModel>
  selectedLibraryId?: UUID
}
type INITIAL_STATE = typeof INITIAL_STATE

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
  }))
)

export type AudiobookState = ReturnType<(typeof useAudiobookState)["getState"]>
