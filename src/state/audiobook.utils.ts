import { Mutate, StoreApi, StoreMutatorIdentifier } from "zustand"
import { unstable_batchedUpdates } from "react-dom"
import { insertAtPosition, replaceRangeInList, toIdRecord } from "../utils/utils"
import { ApiResponse, PaginatedResponse, Position, UUID } from "@thoth/client"
import { WebsocketConnection } from "@thoth/websocket"
import { ChangeEvent } from "@thoth/models/ws"
import { AudiobookState } from "@thoth/state/audiobook.state"

type AssetsToUpdate = "book" | "series" | "author"

export const wrapFetch = <K extends AssetsToUpdate>(
  mutate: Mutate<StoreApi<AudiobookState>, [StoreMutatorIdentifier, unknown][]>,
  key: K,
  fetchFunction: (
    libraryId: UUID,
    offset?: number,
    limit?: number
  ) => Promise<ApiResponse<PaginatedResponse<AudiobookState["content"][UUID][`${K}Map`][string]>>>
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

export const wrapUpdate = <K extends AssetsToUpdate, UPDATE_TYPE>(
  mutate: Mutate<StoreApi<AudiobookState>, [StoreMutatorIdentifier, unknown][]>,
  key: K,
  updateFunction: (
    libraryId: UUID,
    authorId: UUID,
    data: UPDATE_TYPE
  ) => Promise<ApiResponse<AudiobookState["content"][UUID][`${K}Map`][string]>>
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

export const wrapSorting = <K extends AssetsToUpdate>(
  mutate: Mutate<StoreApi<AudiobookState>, [StoreMutatorIdentifier, unknown][]>,
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

export const wrapDetails = <K extends AssetsToUpdate>(
  mutate: Mutate<StoreApi<AudiobookState>, [StoreMutatorIdentifier, unknown][]>,
  key: K,
  detailsFunction: (
    libraryId: UUID,
    id: UUID
  ) => Promise<ApiResponse<AudiobookState["content"][UUID][`${K}Map`][string]>>
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

export const wrapClear = <K extends AssetsToUpdate>(
  mutate: Mutate<StoreApi<AudiobookState>, [StoreMutatorIdentifier, unknown][]>,
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

export const wrapSortingOf = <K extends AssetsToUpdate>(
  mutate: Mutate<StoreApi<AudiobookState>, [StoreMutatorIdentifier, unknown][]>,
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

export const wrapWs = <K extends AssetsToUpdate>(
  mutate: Mutate<StoreApi<AudiobookState>, [StoreMutatorIdentifier, unknown][]>,
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