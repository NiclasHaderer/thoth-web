import { getClient, withBaseUrl, withErrorHandler } from "../client"
import { environment } from "../env"
import { SearchModel } from "../models/api"

const CLIENT = withErrorHandler(withBaseUrl(getClient(), environment.apiURL))

export const SEARCH_CLIENT = {
  search: (q: string) => CLIENT.get<SearchModel>(`/search`, { q }),
}
