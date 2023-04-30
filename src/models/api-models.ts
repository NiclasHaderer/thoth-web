export type ApiError = {
  success: false
  error: string | object
  status?: number
}

export type ApiSuccess<T> = {
  success: true
  body: T
}

export type ApiResponse<T> = ApiError | ApiSuccess<T>

export type ApiCallData = {
  route: string
  method: string
  body?: object
  headers: Headers
  bodySerializer: (body?: object) => string | undefined
  executor: (
    route: string,
    method: string,
    headers: Headers,
    body: string | undefined
  ) => Promise<Response | ApiResponse<any>>
}

export type ApiInterceptor = (param: ApiCallData) => ApiCallData
export interface LoginUser {
  password: string
  username: string
}

export interface JwtPair {
  bearer: string
  refresh: string
}

export interface RegisterUser {
  password: string
  username: string
}

export type UUID = `${string}-${string}-${string}-${string}-${string}` | string

export interface UserModel {
  admin: boolean
  edit: boolean
  id: UUID
  username: string
}

export interface JWK {
  e: string
  kid: string
  kty: string
  n: string
  use: string
}

export interface JWKs {
  keys: Array<JWK>
}

export interface ModifyUser {
  admin?: boolean
  changePassword?: boolean
  edit?: boolean
  enabled?: boolean
  password?: string
  username?: string
}

export interface Unit {}

export interface UsernameChange {
  username: string
}

export interface PasswordChange {
  currentPassword: string
  newPassword: string
}

export interface FileSystemItem {
  name: string
  parent?: string
  path: string
}

export interface FileScanner {
  name: string
}

export interface MetadataAgent {
  name: string
}

export interface LibraryModel {
  fileScanners: Array<FileScanner>
  folders: Array<string>
  icon?: string
  id: UUID
  language: string
  metadataScanners: Array<MetadataAgent>
  name: string
  preferEmbeddedMetadata: boolean
  scanIndex: number
}

export interface LibraryApiModel {
  fileScanners: Array<FileScanner>
  folders: Array<string>
  icon?: string
  language: string
  metadataScanners: Array<MetadataAgent>
  name: string
  preferEmbeddedMetadata: boolean
}

export interface PartialLibraryApiModel {
  fileScanners?: Array<FileScanner>
  folders?: Array<string>
  icon?: string
  metadataScanners?: Array<MetadataAgent>
  name?: string
  preferEmbeddedMetadata?: boolean
}

export interface AuthorModel {
  biography?: string
  birthDate?: string
  bornIn?: string
  deathDate?: string
  id: UUID
  imageID?: UUID
  name: string
  provider?: string
  providerID?: string
  website?: string
}

export interface NamedId {
  id: UUID
  name: string
}

export interface TitledId {
  id: UUID
  title: string
}

export interface BookModel {
  authors: Array<NamedId>
  coverID?: UUID
  description?: string
  genres: Array<NamedId>
  id: UUID
  isbn?: string
  language?: string
  narrator?: string
  provider?: string
  providerID?: string
  providerRating?: number
  publisher?: string
  releaseDate?: string
  series: Array<TitledId>
  title: string
}

export interface SeriesModel {
  authors: Array<NamedId>
  coverID?: UUID
  description?: string
  genres: Array<NamedId>
  id: UUID
  primaryWorks?: number
  provider?: string
  providerID?: string
  title: string
  totalBooks?: number
}

export interface SearchModel {
  authors: Array<AuthorModel>
  books: Array<BookModel>
  series: Array<SeriesModel>
}

export interface MetadataAgentApiModel {
  name: string
  supportedCountryCodes: Array<string>
}

export interface PaginatedResponse<T> {
  items: Array<T>
  limit: number
  offset: number
  total: number
}

export type Order = "ASC" | "DESC"

export interface Position {
  id: UUID
  order: Order
  sortIndex: number
}

export interface TrackModel {
  accessTime: number
  book: TitledId
  duration: number
  id: UUID
  path: string
  title: string
  trackNr?: number
  updateTime: string
}

export interface DetailedBookModel extends BookModel {
  tracks: Array<TrackModel>
}

export interface PartialBookApiModel {
  authors?: Array<UUID>
  cover?: string
  description?: string
  isbn?: string
  language?: string
  narrator?: string
  provider?: string
  providerID?: string
  providerRating?: number
  publisher?: string
  releaseDate?: string
  series?: Array<UUID>
  title?: string
}

export interface BookApiModel {
  authors: Array<UUID>
  cover?: string
  description?: string
  isbn?: string
  language?: string
  narrator?: string
  provider?: string
  providerID?: string
  providerRating?: number
  publisher?: string
  releaseDate?: string
  series?: Array<UUID>
  title: string
}

export interface PaginatedResponse<T> {
  items: Array<T>
  limit: number
  offset: number
  total: number
}

export interface YearRange {
  end: number
  start: number
}

export interface DetailedSeriesModel extends SeriesModel {
  books: Array<BookModel>
  narrators: Array<string>
  yearRange?: YearRange
}

export interface PartialSeriesApiModel {
  authors?: Array<UUID>
  books?: Array<UUID>
  cover?: string
  description?: string
  primaryWorks?: number
  provider?: string
  providerID?: string
  title?: string
  totalBooks?: number
}

export interface SeriesApiModel {
  authors: Array<UUID>
  books: Array<UUID>
  cover?: string
  description?: string
  primaryWorks?: number
  provider?: string
  providerID?: string
  title: string
  totalBooks?: number
}

export interface PaginatedResponse<T> {
  items: Array<T>
  limit: number
  offset: number
  total: number
}

export interface DetailedAuthorModel extends AuthorModel {
  books: Array<BookModel>
  series: Array<SeriesModel>
}

export interface PartialAuthorApiModel {
  biography?: string
  birthDate?: string
  bornIn?: string
  deathDate?: string
  image?: string
  name?: string
  provider?: string
  providerID?: string
  website?: string
}

export interface AuthorApiModel {
  biography?: string
  birthDate?: string
  bornIn?: string
  deathDate?: string
  image?: string
  name: string
  provider?: string
  providerID?: string
  website?: string
}

export type MetadataLanguage =
  | "Spanish"
  | "English"
  | "German"
  | "French"
  | "Italian"
  | "Danish"
  | "Finnish"
  | "Norwegian"
  | "Swedish"
  | "Russian"

export type MetadataSearchCount = "Small" | "Medium" | "Large" | "ExtraLarge"

export interface MetadataProviderWithID {
  itemID: string
  provider: string
}

export interface MetadataSearchAuthor {
  id: MetadataProviderWithID
  link: string
  name?: string
}

export interface MetadataBookSeries {
  id: MetadataProviderWithID
  index?: number
  link: string
  title?: string
}

export interface MetadataSearchBook {
  author?: MetadataSearchAuthor
  coverURL?: string
  id: MetadataProviderWithID
  language?: string
  link?: string
  narrator?: string
  releaseDate?: string
  series: Array<MetadataBookSeries>
  title?: string
}

export interface MetadataAuthor extends MetadataSearchAuthor {
  biography?: string
  birthDate?: string
  bornIn?: string
  deathDate?: string
  imageURL?: string
  website?: string
}

export interface MetadataBook extends MetadataSearchBook {
  description?: string
  isbn?: string
  providerRating?: number
  publisher?: string
}

export interface MetadataSeries {
  author?: string
  books?: Array<MetadataSearchBook>
  coverURL?: string
  description?: string
  id: MetadataProviderWithID
  link: string
  primaryWorks?: number
  title?: string
  totalBooks?: number
}
