import create, { SetState } from "zustand"
import { GetState } from "zustand/vanilla"
import { ChangeEvent } from "../API/models/Audiobook"
import { AudiobookClient } from "../API/AudiobookClient"
import { environment } from "../env"
import { websocketWithBaseUrl } from "../Websocket"
import { CrudState } from "./CrudState"

export const useAudiobookState = create(
  (set, get) =>
    ({
      ...CrudState(
        "Authors",
        {
          fetchFunction: AudiobookClient.fetchAuthors,
          detailsFunction: AudiobookClient.fetchAuthorWithBooks,
          sortingFunction: AudiobookClient.fetchAuthorSorting,
          updateFunction: AudiobookClient.updateAuthor,
          ws: websocketWithBaseUrl<ChangeEvent>(environment.apiURL, "ws/authors"),
        },
        set as SetState<any>,
        get as GetState<any>
      ),
      ...CrudState(
        "Series",
        {
          fetchFunction: AudiobookClient.fetchSeries,
          detailsFunction: AudiobookClient.fetchSeriesWithBooks,
          sortingFunction: AudiobookClient.fetchSeriesSorting,
          updateFunction: AudiobookClient.updateSeries,
          ws: websocketWithBaseUrl<ChangeEvent>(environment.apiURL, "ws/series"),
        },
        set as SetState<any>,
        get as GetState<any>
      ),
      ...CrudState(
        "Books",
        {
          fetchFunction: AudiobookClient.fetchBooks,
          detailsFunction: AudiobookClient.fetchBookWithTracks,
          sortingFunction: AudiobookClient.fetchBookSorting,
          updateFunction: AudiobookClient.updateBook,
          ws: websocketWithBaseUrl<ChangeEvent>(environment.apiURL, "ws/books"),
        },
        set as SetState<any>,
        get as GetState<any>
      ),
    } as const)
)

export type AudiobookState = ReturnType<typeof useAudiobookState["getState"]>
