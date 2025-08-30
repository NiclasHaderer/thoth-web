/* eslint-disable */
// @ts-nocheck
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

export interface ThothUser {
  id: UUID
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

export interface ThothJWKs {
  keys: Array<JWK>
}

export type UpdatePermissions = "READONLY" | "READ_WRITE"

export interface UpdateLibraryPermissions {
  id: UUID
  permissions: UpdatePermissions
}

export interface UpdateUserPermissions {
  isAdmin: boolean
  libraries: Array<UpdateLibraryPermissions>
}

export interface ThothModifyPermissions<PERMISSIONS> {
  permissions: PERMISSIONS
}

export interface LibraryPermissions {
  id: UUID
  name: string
  permissions: UpdatePermissions
}

export interface UserPermissions {
  isAdmin: boolean
  libraries: Array<LibraryPermissions>
}

export interface ThothUserWithPermissions<PERMISSIONS extends NonNullable<any>> {
  id: UUID
  permissions: PERMISSIONS
  username: string
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

export interface NamedMetadataAgent {
  name: string
}

export interface Library {
  fileScanners: Array<FileScanner>
  folders: Array<string>
  icon: string | undefined
  id: UUID
  language: string
  metadataScanners: Array<NamedMetadataAgent>
  name: string
  preferEmbeddedMetadata: boolean
  scanIndex: number
}

export interface LibraryCreate {
  fileScanners: Array<FileScanner>
  folders: Array<string>
  icon: string | undefined
  language: string
  metadataScanners: Array<NamedMetadataAgent>
  name: string
  preferEmbeddedMetadata: boolean
}

export interface LibraryUpdate {
  fileScanners: Array<FileScanner> | undefined
  folders: Array<string> | undefined
  icon: string | undefined
  language: string | undefined
  metadataScanners: Array<NamedMetadataAgent> | undefined
  name: string | undefined
  preferEmbeddedMetadata: boolean | undefined
}

export interface NamedId {
  id: UUID
  name: string
}

export interface Author {
  biography: string | undefined
  birthDate: string | undefined
  bornIn: string | undefined
  deathDate: string | undefined
  id: UUID
  imageID: UUID | undefined
  library: NamedId
  name: string
  provider: string | undefined
  providerID: string | undefined
  website: string | undefined
}

export interface TitledId {
  id: UUID
  title: string
}

export interface Book {
  authors: Array<NamedId>
  coverID: UUID | undefined
  description: string | undefined
  genres: Array<NamedId>
  id: UUID
  isbn: string | undefined
  language: string | undefined
  library: NamedId
  narrator: string | undefined
  provider: string | undefined
  providerID: string | undefined
  providerRating: number | undefined
  publisher: string | undefined
  releaseDate: string | undefined
  series: Array<TitledId>
  title: string
}

export interface Series {
  authors: Array<NamedId>
  coverID: UUID | undefined
  description: string | undefined
  genres: Array<NamedId>
  id: UUID
  library: NamedId
  primaryWorks: number | undefined
  provider: string | undefined
  providerID: string | undefined
  title: string
  totalBooks: number | undefined
}

export interface LibrarySearchResult {
  authors: Array<Author>
  books: Array<Book>
  series: Array<Series>
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

export interface Track {
  accessTime: number
  book: TitledId
  duration: number
  id: UUID
  library: NamedId
  path: string
  title: string
  trackNr: number | undefined
  updateTime: string
}

export interface BookDetailed extends Book {
  tracks: Array<Track>
}

export interface BookUpdate {
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

export interface YearRange {
  end: number
  start: number
}

export interface SeriesDetailed extends Series {
  books: Array<Book>
  narrators: Array<string>
  yearRange: YearRange | undefined
}

export interface SeriesUpdate {
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

export interface AuthorDetailed extends Author {
  books: Array<Book>
  series: Array<Series>
}

export interface AuthorUpdate {
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

export interface MetadataAgentID {
  itemID: string
  provider: string
}

export interface MetadataSearchAuthor {
  id: MetadataAgentID
  link: string
  name: string | undefined
}

export interface MetadataBookSeries {
  id: MetadataAgentID
  index: number | undefined
  link: string
  title: string | undefined
}

export interface MetadataSearchBook {
  authors: Array<MetadataSearchAuthor> | undefined
  coverURL: string | undefined
  id: MetadataAgentID
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
  id: MetadataAgentID
  link: string
  primaryWorks: number | undefined
  title: string | undefined
  totalBooks: number | undefined
}
