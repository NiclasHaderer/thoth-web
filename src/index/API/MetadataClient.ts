import { getClient, withBaseUrl, withCaching, withErrorHandler } from "../Client"
import { environment } from "../env"
import { BookMetadata } from "./models/Metadat"

const CLIENT = (() => {
  let client = withErrorHandler(withBaseUrl(getClient(), environment.apiURL))
  if (environment.production) {
    client = withCaching(client, { useGlobalCache: false })
  }
  return client
})()

export const METADATA_CLIENT = {
  findBook: ({ bookName, authorName }: { bookName: string; authorName?: string }) =>
    CLIENT.get<BookMetadata[]>(`/metadata/book/title/${bookName}`, { authorName: authorName || null }),
}
