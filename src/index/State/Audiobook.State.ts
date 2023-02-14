import create, { SetState } from "zustand"
import { GetState } from "zustand/vanilla"
import { AudiobookClient } from "../API/AudiobookClient"
import { CrudState } from "./CrudState"
import { AudiobookSelectors } from "./Audiobook.Selectors"

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
          positionFunction: AudiobookClient.fetchAuthorPosition,
          //ws: websocketWithBaseUrl<ChangeEvent>(environment.apiURL, "ws/authors"),
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
          positionFunction: AudiobookClient.fetchSeriesPosition,
          //ws: websocketWithBaseUrl<ChangeEvent>(environment.apiURL, "ws/series"),
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
          positionFunction: AudiobookClient.fetchBookPosition,
          //ws: websocketWithBaseUrl<ChangeEvent>(environment.apiURL, "ws/books"),
        },
        set as SetState<any>,
        get as GetState<any>
      ),
    } as const)
)

export type AudiobookState = ReturnType<typeof useAudiobookState["getState"]>