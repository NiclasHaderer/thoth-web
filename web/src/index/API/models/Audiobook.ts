export interface ProviderWithIDMetadata {
  itemID: string
  provider: string
}

export interface ProviderIDModel extends ProviderWithIDMetadata {
  itemID: string
  provider: string
}

export interface IAuthorModel {
  biography: string | null
  id: string
  image: string | null
  name: string
  providerID: ProviderIDModel | null
}

export interface AuthorModel extends IAuthorModel {
  biography: string | null
  id: string
  image: string | null
  name: string
  providerID: ProviderIDModel | null
}

export interface NamedId {
  id: string
  name: string
}

export interface TitledId {
  id: string
  title: string
}

export interface IBookModel {
  author: NamedId
  cover: string | null
  description: string | null
  id: string
  language: string | null
  narrator: string | null
  providerID: ProviderIDModel | null
  series: TitledId | null
  seriesIndex: number | null
  title: string
  updateTime: number
  year: number | null
}

export interface BookModel extends IBookModel {
  author: NamedId
  cover: string | null
  description: string | null
  id: string
  language: string | null
  narrator: string | null
  providerID: ProviderIDModel | null
  series: TitledId | null
  seriesIndex: number | null
  title: string
  updateTime: number
  year: number | null
}

export interface AuthorModelWithBooks extends IAuthorModel {
  biography: string | null
  books: BookModel[]
  id: string
  image: string | null
  name: string
  position: number
  providerID: ProviderIDModel | null
}

export interface TrackModel {
  accessTime: number
  book: TitledId
  duration: number
  id: string
  path: string
  title: string
  trackNr: number | null
  updateTime: number
}

export interface BookModelWithTracks extends IBookModel {
  author: NamedId
  cover: string | null
  description: string | null
  id: string
  language: string | null
  narrator: string | null
  position: number
  providerID: ProviderIDModel | null
  series: TitledId | null
  seriesIndex: number | null
  title: string
  tracks: TrackModel[]
  updateTime: number
  year: number | null
}

export interface ISeriesModel {
  amount: number
  author: NamedId
  description: string | null
  id: string
  images: string[]
  providerID: ProviderIDModel | null
  title: string
  updateTime: number
}

export interface SeriesModel extends ISeriesModel {
  amount: number
  author: NamedId
  description: string | null
  id: string
  images: string[]
  providerID: ProviderIDModel | null
  title: string
  updateTime: number
}

export interface SearchModel {
  authors: AuthorModel[]
  books: BookModel[]
  series: SeriesModel[]
}

export interface PatchAuthor {
  biography: string | null
  image: string | null
  name: string
  providerID: ProviderIDModel | null
}

export interface PatchSeries {
  description: string | null
  providerID: ProviderIDModel | null
  title: string
  author: string | null
}

export interface PatchBook {
  author: string
  cover: string | null
  description: string | null
  language: string | null
  narrator: string | null
  providerID: ProviderIDModel | null
  series: string | null
  seriesIndex: number | null
  title: string
  year: number | null
}

export interface YearRange {
  end: number
  start: number
}

export interface SeriesModelWithBooks extends ISeriesModel {
  amount: number
  author: NamedId
  books: BookModel[]
  description: string | null
  id: string
  images: string[]
  narrators: string[]
  position: number
  providerID: ProviderIDModel | null
  title: string
  updateTime: number
  yearRange: YearRange | null
}

type EntityChangeType = "Created" | "Updated" | "Removed"

export interface ChangeEvent {
  id: string
  type: EntityChangeType
}

export interface PaginatedResponse<T> {
  items: T[]
  limit: number
  offset: number
  total: number
}
