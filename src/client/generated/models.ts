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

export type LibraryPermissionLevel = "READONLY" | "READ_WRITE"

export interface UpdateLibraryPermissions {
  id: UUID
  permissions: LibraryPermissionLevel
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
  permissions: LibraryPermissionLevel
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

export type MetadataLanguage =
  "Spanish" | "English" | "German" | "French" | "Italian" | "Danish" | "Finnish" | "Norwegian" | "Swedish" | "Russian"

export interface NamedMetadataAgent {
  name: string
}

export type MetadataRegion = "AU" | "CA" | "DE" | "ES" | "FR" | "IN" | "IT" | "JP" | "US" | "UK"

export interface Library {
  bookCount: number
  fileScanners: Array<FileScanner>
  folders: Array<string>
  icon: string | undefined
  id: UUID
  language: MetadataLanguage
  metadataAgents: Array<NamedMetadataAgent>
  name: string
  preferEmbeddedMetadata: boolean
  region: MetadataRegion
}

export interface UpdateLibrary {
  fileScanners: Array<FileScanner>
  folders: Array<string>
  icon: string | undefined
  language: MetadataLanguage
  metadataAgents: Array<NamedMetadataAgent>
  name: string
  preferEmbeddedMetadata: boolean
  region: MetadataRegion
}

export interface PartialUpdateLibrary {
  fileScanners: Array<FileScanner> | undefined
  folders: Array<string> | undefined
  icon: string | undefined
  language: MetadataLanguage | undefined
  metadataAgents: Array<NamedMetadataAgent> | undefined
  name: string | undefined
  preferEmbeddedMetadata: boolean | undefined
  region: MetadataRegion | undefined
}

export interface Author {
  biography: string | undefined
  birthDate: number | undefined
  bornIn: string | undefined
  deathDate: number | undefined
  id: UUID
  imageID: UUID | undefined
  libraryId: UUID
  name: string
  provider: string | undefined
  providerID: string | undefined
  website: string | undefined
}

export interface NamedId {
  id: UUID
  name: string
}

export interface TitledId {
  id: UUID
  title: string
}

export type PlayStatus = "UNPLAYED" | "IN_PROGRESS" | "FINISHED"

export interface Book {
  authors: Array<NamedId>
  coverID: UUID | undefined
  description: string | undefined
  durationMs: number
  genres: Array<string>
  id: UUID
  isbn: string | undefined
  language: MetadataLanguage | undefined
  libraryId: UUID
  narrators: Array<string>
  positionMs: number
  provider: string | undefined
  providerID: string | undefined
  providerRating: number | undefined
  publisher: string | undefined
  releaseDate: number | undefined
  series: Array<TitledId>
  status: PlayStatus
  title: string
}

export interface Series {
  authors: Array<NamedId>
  bookCoverIDs: Array<UUID>
  coverID: UUID | undefined
  description: string | undefined
  genres: Array<string>
  id: UUID
  libraryId: UUID
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

export interface MetadataAgentApiModel {
  name: string
  supportedRegions: Array<MetadataRegion>
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
  book: TitledId
  durationMs: number
  fileModifiedAt: number
  id: UUID
  title: string
  trackNr: number | undefined
}

export interface BookDetailed extends Book {
  tracks: Array<Track>
}

export interface BookUpdate {
  authors: Array<UUID> | undefined
  cover: string | undefined
  description: string | undefined
  genres: Array<string> | undefined
  isbn: string | undefined
  language: MetadataLanguage | undefined
  narrators: Array<string> | undefined
  provider: string | undefined
  providerID: string | undefined
  providerRating: number | undefined
  publisher: string | undefined
  releaseDate: number | undefined
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

export interface SeriesCreate {
  title: string
}

export interface SeriesUpdate {
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

export interface AuthorCreate {
  name: string
}

export interface AuthorUpdate {
  biography: string | undefined
  birthDate: number | undefined
  books: Array<UUID> | undefined
  bornIn: string | undefined
  deathDate: number | undefined
  image: string | undefined
  name: string | undefined
  provider: string | undefined
  providerID: string | undefined
  website: string | undefined
}

export interface Narrator {
  bookCount: number
  name: string
}

export interface NarratorDetailed {
  books: Array<Book>
  name: string
}

export interface Genre {
  bookCount: number
  name: string
}

export interface GenreDetailed {
  books: Array<Book>
  name: string
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

export interface MetadataAuthor extends MetadataSearchAuthor {
  biography: string | undefined
  birthDate: number | undefined
  bornIn: string | undefined
  deathDate: number | undefined
  imageURL: string | undefined
  website: string | undefined
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
  language: MetadataLanguage | undefined
  link: string | undefined
  narrators: Array<string>
  releaseDate: number | undefined
  series: Array<MetadataBookSeries>
  title: string | undefined
}

export interface MetadataBook extends MetadataSearchBook {
  description: string | undefined
  isbn: string | undefined
  providerRating: number | undefined
  publisher: string | undefined
}

export type MetadataSearchCount = "Small" | "Medium" | "Large" | "ExtraLarge"

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

export interface ProgressUpdate {
  positionMs: number
}

export interface SetFinished {
  finished: boolean
}

export interface SetDismissed {
  dismissed: boolean
}

export interface ListeningHistoryEntry {
  at: number
  book: Book
  id: UUID
  positionMs: number
}

export interface ThirdPartyLicense {
  license: string
  licenseUrl: string | undefined
  name: string
  repository: string | undefined
  text: string | undefined
  version: string
}
