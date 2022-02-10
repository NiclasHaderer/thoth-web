import { getClient, withBaseUrl, withCaching, withErrorHandler } from "../Client"
import { environment } from "../env"
import { SearchModel } from "./models/Audiobook"

const CLIENT = (() => {
  let client = withErrorHandler(withBaseUrl(getClient(), environment.apiURL))
  if (environment.production) {
    client = withCaching(client, { useGlobalCache: false })
  }
  return client
})()

export const SEARCH_CLIENT = {
  search: (q: string) => CLIENT.get<SearchModel>(`/search`, { q }),
}
