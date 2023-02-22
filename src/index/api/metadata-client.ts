import { getClient, withBaseUrl, withErrorHandler } from "../client"
import { environment } from "../env"
import { MetadataAuthor, MetadataBook, MetadataSeries } from "../models/metadata"

const CLIENT = withErrorHandler(withBaseUrl(getClient(), environment.apiURL))

export const METADATA_CLIENT = {
  findBook: ({ bookName, authorName }: { bookName: string; authorName?: string }) =>
    CLIENT.get<MetadataBook[]>(`/metadata/book/search/${bookName}`, { authorName: authorName || null }),
  findAuthor: ({ authorName }: { authorName: string }) =>
    CLIENT.get<MetadataAuthor[]>(`/metadata/author/search/${authorName}`),
  findSeries: ({ name, authorName }: { name: string; authorName?: string }) =>
    CLIENT.get<MetadataSeries[]>(`/metadata/series/search/${name}`, { authorName: authorName || null }),
}
