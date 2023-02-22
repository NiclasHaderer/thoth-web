import { getClient, withBaseUrl, withErrorHandler } from "../client"
import { environment } from "../env"
import { MetadataAuthor, MetadataBook, MetadataSeries } from "../models/metadata"

const CLIENT = withErrorHandler(withBaseUrl(getClient(), environment.apiURL))

export const METADATA_CLIENT = {
  findBook: ({ bookName, authorName }: { bookName: string; authorName?: string }) =>
    CLIENT.get<MetadataBook[]>(`/metadata/book/search`, { authorName: authorName || null, name: bookName }),
  findAuthor: ({ authorName }: { authorName: string }) =>
    CLIENT.get<MetadataAuthor[]>(`/metadata/author/search`, { name: authorName }),
  findSeries: ({ name, authorName }: { name: string; authorName?: string }) =>
    CLIENT.get<MetadataSeries[]>(`/metadata/series/search`, { authorName: authorName || null, name: name }),
}
