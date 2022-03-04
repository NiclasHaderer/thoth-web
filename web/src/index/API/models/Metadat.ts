export interface ProviderWithIDMetadata {
  itemID: string
  provider: string
}

export interface SearchAuthorMetadata {
  id: ProviderWithIDMetadata
  link: string
  name: string | null
}

export interface AuthorMetadata extends SearchAuthorMetadata {
  biography: string | null
  image: string | null
}

export interface SearchSeriesMetadata {
  id: ProviderWithIDMetadata
  index: number | null
  link: string
  name: string
}

export interface BookMetadata {
  author: SearchAuthorMetadata | null
  description: string | null
  id: ProviderWithIDMetadata
  image: string | null
  link: string | null
  narrator: string | null
  series: SearchSeriesMetadata | null
  title: string | null
}

export interface SearchBookMetadata {
  author: SearchAuthorMetadata | null
  id: ProviderWithIDMetadata
  image: string | null
  language: string | null
  link: string | null
  narrator: string | null
  releaseDate: number | null
  series: SearchSeriesMetadata | null
  title: string | null
}

export interface SeriesMetadata {
  author: string | null
  amount: number | null
  books: SearchBookMetadata[] | null
  description: string | null
  id: ProviderWithIDMetadata
  link: string
  name: string | null
}
