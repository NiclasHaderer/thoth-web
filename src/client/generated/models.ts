/* eslint-disable */
import type { Pair } from "./utility-types"

export interface ThothAccessToken {
  accessToken: string
}

export interface ThothLoginUser {
  password: string
  username: string
}

export type Empty = ""

export type UUID = `${string}-${string}-${string}-${string}-${string}`

export interface ThothUserPermissions {
  isAdmin: boolean
}

export interface LibraryPermissionsModel {
  canEdit: boolean
  id: UUID
  name: string
}

export interface UserPermissionsModel extends ThothUserPermissions {
  libraries: Array<LibraryPermissionsModel>
}

export interface ThothUser<ID extends NonNullable<any>, PERMISSIONS extends ThothUserPermissions> {
  id: ID
  permissions: PERMISSIONS
  username: string
}

export interface ThothRegisterUser {
  password: string
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

export interface ThothModifyPermissions<PERMISSIONS extends ThothUserPermissions> {
  permissions: PERMISSIONS
}

export interface ThothRenameUser {
  username: string
}

export interface ThothChangePassword {
  currentPassword: string
  newPassword: string
}

export interface FileSystemItem {
  name: string
  parent: string | undefined
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
  icon: string | undefined
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
  icon: string | undefined
  language: string
  metadataScanners: Array<MetadataAgent>
  name: string
  preferEmbeddedMetadata: boolean
}

export interface PartialLibraryApiModel {
  fileScanners: Array<FileScanner> | undefined
  folders: Array<string> | undefined
  icon: string | undefined
  language: string | undefined
  metadataScanners: Array<MetadataAgent> | undefined
  name: string | undefined
  preferEmbeddedMetadata: boolean | undefined
}

export interface TitledId {
  id: UUID
  title: string
}

export interface AuthorModel {
  biography: string | undefined
  birthDate: string | undefined
  bornIn: string | undefined
  deathDate: string | undefined
  id: UUID
  imageID: UUID | undefined
  library: TitledId
  name: string
  provider: string | undefined
  providerID: string | undefined
  website: string | undefined
}

export interface NamedId {
  id: UUID
  name: string
}

export interface BookModel {
  authors: Array<NamedId>
  coverID: UUID | undefined
  description: string | undefined
  genres: Array<NamedId>
  id: UUID
  isbn: string | undefined
  language: string | undefined
  library: TitledId
  narrator: string | undefined
  provider: string | undefined
  providerID: string | undefined
  providerRating: number | undefined
  publisher: string | undefined
  releaseDate: string | undefined
  series: Array<TitledId>
  title: string
}

export interface SeriesModel {
  authors: Array<NamedId>
  coverID: UUID | undefined
  description: string | undefined
  genres: Array<NamedId>
  id: UUID
  library: TitledId
  primaryWorks: number | undefined
  provider: string | undefined
  providerID: string | undefined
  title: string
  totalBooks: number | undefined
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
  trackNr: number | undefined
  updateTime: string
}

export interface DetailedBookModel extends BookModel {
  tracks: Array<TrackModel>
}

export interface PartialBookApiModel {
  authors: Array<UUID> | undefined
  cover: string | undefined
  description: string | undefined
  isbn: string | undefined
  language: string | undefined
  narrator: string | undefined
  provider: string | undefined
  providerID: string | undefined
  providerRating: number | undefined
  publisher: string | undefined
  releaseDate: string | undefined
  series: Array<UUID> | undefined
  title: string | undefined
}

export interface BookApiModel {
  authors: Array<UUID>
  cover: string | undefined
  description: string | undefined
  isbn: string | undefined
  language: string | undefined
  narrator: string | undefined
  provider: string | undefined
  providerID: string | undefined
  providerRating: number | undefined
  publisher: string | undefined
  releaseDate: string | undefined
  series: Array<UUID> | undefined
  title: string
}

export interface YearRange {
  end: number
  start: number
}

export interface DetailedSeriesModel extends SeriesModel {
  books: Array<BookModel>
  narrators: Array<string>
  yearRange: YearRange | undefined
}

export interface PartialSeriesApiModel {
  authors: Array<UUID> | undefined
  books: Array<UUID> | undefined
  cover: string | undefined
  description: string | undefined
  primaryWorks: number | undefined
  provider: string | undefined
  providerID: string | undefined
  title: string | undefined
  totalBooks: number | undefined
}

export interface SeriesApiModel {
  authors: Array<UUID>
  books: Array<UUID>
  cover: string | undefined
  description: string | undefined
  primaryWorks: number | undefined
  provider: string | undefined
  providerID: string | undefined
  title: string
  totalBooks: number | undefined
}

export interface DetailedAuthorModel extends AuthorModel {
  books: Array<BookModel>
  series: Array<SeriesModel>
}

export interface PartialAuthorApiModel {
  biography: string | undefined
  birthDate: string | undefined
  bornIn: string | undefined
  deathDate: string | undefined
  image: string | undefined
  name: string | undefined
  provider: string | undefined
  providerID: string | undefined
  website: string | undefined
}

export interface AuthorApiModel {
  biography: string | undefined
  birthDate: string | undefined
  bornIn: string | undefined
  deathDate: string | undefined
  image: string | undefined
  name: string
  provider: string | undefined
  providerID: string | undefined
  website: string | undefined
}

export interface MetadataProviderWithID {
  itemID: string
  provider: string
}

export interface MetadataSearchAuthor {
  id: MetadataProviderWithID
  link: string
  name: string | undefined
}

export interface MetadataBookSeries {
  id: MetadataProviderWithID
  index: number | undefined
  link: string
  title: string | undefined
}

export interface MetadataSearchBook {
  authors: Array<MetadataSearchAuthor> | undefined
  coverURL: string | undefined
  id: MetadataProviderWithID
  language: string | undefined
  link: string | undefined
  narrator: string | undefined
  releaseDate: string | undefined
  series: Array<MetadataBookSeries>
  title: string | undefined
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

export interface MetadataAuthor extends MetadataSearchAuthor {
  biography: string | undefined
  birthDate: string | undefined
  bornIn: string | undefined
  deathDate: string | undefined
  imageURL: string | undefined
  website: string | undefined
}

export interface MetadataBook extends MetadataSearchBook {
  description: string | undefined
  isbn: string | undefined
  providerRating: number | undefined
  publisher: string | undefined
}

export interface MetadataSeries {
  authors: Array<string> | undefined
  books: Array<MetadataSearchBook> | undefined
  coverURL: string | undefined
  description: string | undefined
  id: MetadataProviderWithID
  link: string
  primaryWorks: number | undefined
  title: string | undefined
  totalBooks: number | undefined
}
