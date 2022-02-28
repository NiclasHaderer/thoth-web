import { unstable_batchedUpdates } from "react-dom"
import { GetState } from "zustand/vanilla"

import { ChangeEvent, PaginatedResponse } from "../API/models/Audiobook"
import { insertAtPosition, replaceRangeInList, toIdRecord } from "../helpers"
import { WebsocketConnection } from "../Websocket"
import { SetState } from "zustand"

type OPromise<T> = Promise<T> | T

type CrudReturn<
  KEY extends string,
  TYPE extends { id: string },
  DETAIL_TYPE extends { id: string },
  UPDATE_TYPE extends { id: string }
> = {
  [K in KEY as `${K}Sorting`]: string[]
} & {
  [K in KEY as `${K}Total`]: number
} & {
  [K in KEY as `${K}Mapping`]: Record<string, TYPE | DETAIL_TYPE>
} & {
  [K in KEY as `fetch${K}`]: (offset: number, limit?: number) => void
} & {
  [K in KEY as `fetch${K}Sorting`]: (offset: number, limit?: number) => void
} & {
  [K in KEY as `fetch${K}Details`]: (id: string) => void
} & {
  [K in KEY as `update${K}`]: (data: UPDATE_TYPE) => void
} & {
  [K in KEY as `clear${K}`]: () => void
}

export const CrudState = <
  KEY extends string,
  COLLECTION extends PaginatedResponse<{ id: string }>,
  DETAILS extends { id: string } & COLLECTION["items"][number] & { position: number },
  UPDATE extends { id: string },
  SORTING_STATE extends { [K in KEY as `${K}Sorting`]: string[] },
  MAPPING_STATE extends { [K in KEY as `${K}Mapping`]: Record<string, { id: string }> }
>(
  key: KEY,
  config: {
    fetchFunction: (offset: number, limit: number) => OPromise<COLLECTION | undefined>
    detailsFunction: (id: string) => OPromise<DETAILS | undefined>
    sortingFunction: (offset: number, limit: number) => OPromise<string[] | undefined>
    updateFunction: (data: UPDATE) => OPromise<COLLECTION["items"][number] | undefined>
    ws?: WebsocketConnection<ChangeEvent>
  },
  set: SetState<SORTING_STATE & MAPPING_STATE>,
  get: GetState<SORTING_STATE & MAPPING_STATE>
): CrudReturn<KEY, COLLECTION["items"][number], DETAILS, UPDATE> => {
  const crudState = {
    // TODO update total count if you add a new book to the library
    [`${key}Total`]: null,
    [`${key}Sorting`]: [],
    [`${key}Mapping`]: {},
    [`fetch${key}`]: async (offset: number, limit: number = 30) => {
      const response = await config.fetchFunction(offset, limit)
      if (!response) return
      set(state => ({
        ...state,
        [`${key}Total`]: response.total,
        [`${key}Mapping`]: {
          ...state[`${key}Mapping`],
          ...toIdRecord(response.items),
        },
        [`${key}Sorting`]: replaceRangeInList(
          (state as SORTING_STATE)[`${key}Sorting`],
          offset * limit,
          response.items
        ),
      }))
    },
    [`fetch${key}Sorting`]: async (offset: number, limit: number = 30) => {
      const response = await config.sortingFunction(offset, limit)
      if (!response) return
      set(state => ({
        ...state,
        [`${key}Sorting`]: replaceRangeInList((state as SORTING_STATE)[`${key}Sorting`], offset * limit, response),
      }))
    },
    [`fetch${key}Details`]: async (id: string) => {
      const response = await config.detailsFunction(id)
      if (!response) return

      set(state => ({
        ...state,
        [`${key}Mapping`]: {
          ...state[`${key}Mapping`],
          [response.id]: response,
        },
        [`${key}Sorting`]: insertAtPosition((state as SORTING_STATE)[`${key}Sorting`], response.id, response.position),
      }))
    },
    [`update${key}`]: async (data: UPDATE) => {
      const response = await config.updateFunction(data)
      if (!response) return
      set(state => ({
        ...state,
        [`${key}Mapping`]: {
          ...state[`${key}Mapping`],
          [response.id]: {
            ...((state as MAPPING_STATE)[`${key}Mapping`][data.id] || {}),
            ...response,
          },
        },
      }))
    },
    [`clear${key}`]: async () => {
      const newState = {
        [`${key}Total`]: null,
        [`${key}Sorting`]: [],
        [`${key}Mapping`]: {},
      }
      set(newState as any)
    },
  } as const

  if (!config.ws) return crudState as CrudReturn<KEY, COLLECTION["items"][number], DETAILS, UPDATE>

  const idIsInState = (id: string) => {
    const state = get()
    const mappingState = (state as MAPPING_STATE)[`${key}Mapping`]
    const sortingState = (state as SORTING_STATE)[`${key}Sorting`]
    return id in mappingState || sortingState.includes(id)
  }

  const handleUpdate = (id: string) => {
    const fetchDetails = crudState[`fetch${key}Details`] as (id: string) => void
    fetchDetails(id)
  }

  const handleRemove = (id: string) => {
    if (!idIsInState(id)) return

    const state = get()

    const newMappingState = { ...(state as MAPPING_STATE)[`${key}Mapping`] }
    delete newMappingState[id]

    set(state => ({
      ...state,
      [`${key}Mapping`]: newMappingState,
      [`${key}Sorting`]: (state as SORTING_STATE)[`${key}Sorting`].filter(i => i !== id),
    }))
  }

  config.ws.onMessage(m =>
    unstable_batchedUpdates(() => {
      if (m.type === "Removed") {
        handleRemove(m.id)
      } else {
        handleUpdate(m.id)
      }
    })
  )

  return crudState as CrudReturn<KEY, COLLECTION["items"][number], DETAILS, UPDATE>
}
