export interface IAuthorModel {
  biography: string | null
  birthDate: number | null
  bornIn: string | null
  deathDate: number | null
  id: string
  imageID: string | null
  name: string
  provider: string | null
  website: string | null
}

export interface AuthorModel extends IAuthorModel {
  biography: string | null
  birthDate: number | null
  bornIn: string | null
  deathDate: number | null
  id: string
  imageID: string | null
  name: string
  provider: string | null
  website: string | null
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
  authors: NamedId[]
  coverID: string | null
  description: string | null
  id: string
  isbn: string | null
  language: string | null
  narrator: string | null
  provider: string | null
  providerID: string | null
  providerRating: number | null
  publisher: string | null
  releaseDate: number | null
  series: TitledId[]
  title: string
}

export interface ISeriesModel {
  authors: NamedId[]
  coverID: string | null
  description: string | null
  id: string
  primaryWorks: number | null
  provider: string | null
  providerID: string | null
  title: string
  totalBooks: number | null
}

export interface AuthorModelWithBooks extends IAuthorModel {
  biography: string | null
  birthDate: number | null
  books: IBookModel[]
  bornIn: string | null
  deathDate: number | null
  id: string
  imageID: string | null
  name: string
  provider: string | null
  series: ISeriesModel[]
  website: string | null
}

export interface BookModel extends IBookModel {
  authors: NamedId[]
  coverID: string | null
  description: string | null
  id: string
  isbn: string | null
  language: string | null
  narrator: string | null
  provider: string | null
  providerID: string | null
  providerRating: number | null
  publisher: string | null
  releaseDate: number | null
  series: TitledId[]
  title: string
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
  authors: NamedId[]
  coverID: string | null
  description: string | null
  id: string
  isbn: string | null
  language: string | null
  narrator: string | null
  provider: string | null
  providerID: string | null
  providerRating: number | null
  publisher: string | null
  releaseDate: number | null
  series: TitledId[]
  title: string
  tracks: TrackModel[]
}

export interface SeriesModel extends ISeriesModel {
  authors: NamedId[]
  coverID: string | null
  description: string | null
  id: string
  primaryWorks: number | null
  provider: string | null
  providerID: string | null
  title: string
  totalBooks: number | null
}

export interface SearchModel {
  authors: AuthorModel[]
  books: BookModel[]
  series: SeriesModel[]
}

export interface PatchAuthor {
  biography: string | null
  birthDate: number | null
  bornIn: string | null
  deathDate: number | null
  image: string | null
  name: string | null
  provider: string | null
  website: string | null
}

export interface PatchSeries {
  authors: string[] | null
  books: string[] | null
  cover: string | null
  description: string | null
  primaryWorks: number | null
  provider: string | null
  providerID: string | null
  title: string | null
  totalBooks: number | null
}

export interface PatchBook {
  authors: string[] | null
  cover: string | null
  description: string | null
  isbn: string | null
  language: string | null
  narrator: string | null
  provider: string | null
  providerID: string | null
  providerRating: number | null
  publisher: string | null
  releaseDate: number | null
  series: string[] | null
  title: string | null
}

export interface YearRange {
  end: number
  start: number
}

export interface SeriesModelWithBooks extends ISeriesModel {
  authors: NamedId[]
  books: IBookModel[]
  coverID: string | null
  description: string | null
  id: string
  narrators: string[]
  primaryWorks: number | null
  provider: string | null
  providerID: string | null
  title: string
  totalBooks: number | null
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

export interface Position {
  sortIndex: number
  id: string
  order: "ASC" | "DESC"
}