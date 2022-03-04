import { getClient, withBaseUrl, withCaching, withErrorHandler } from "../Client"
import { environment } from "../env"
import { AuthorMetadata, BookMetadata, SeriesMetadata } from "./models/Metadat"

const CLIENT = (() => {
  let client = withErrorHandler(withBaseUrl(getClient(), environment.apiURL))
  if (environment.production) {
    client = withCaching(client, { useGlobalCache: false })
  }
  return client
})()

export const METADATA_CLIENT = {
  findBook: ({ bookName, authorName }: { bookName: string; authorName?: string }) =>
    CLIENT.get<BookMetadata[]>(`/metadata/book/search/${bookName}`, { authorName: authorName || null }),
  findAuthor: ({ authorName }: { authorName: string }) =>
    CLIENT.get<AuthorMetadata[]>(`/metadata/author/search/${authorName}`),
  findSeries: ({ name, authorName }: { name: string; authorName?: string }) =>
    CLIENT.get<SeriesMetadata[]>(`/metadata/series/search/${name}`, { authorName: authorName || null }),
}
