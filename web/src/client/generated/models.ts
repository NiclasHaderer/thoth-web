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
  parent: string | null
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
  combineFileScannerFields: boolean
  combineMetadataAgentFields: boolean
  fileScanners: Array<FileScanner>
  folders: Array<string>
  icon: string | null
  id: UUID
  language: MetadataLanguage
  metadataAgents: Array<NamedMetadataAgent>
  name: string
  preferEmbeddedMetadata: boolean
  region: MetadataRegion
}

export interface UpdateLibrary {
  combineFileScannerFields: boolean
  combineMetadataAgentFields: boolean
  fileScanners: Array<FileScanner>
  folders: Array<string>
  icon: string | null
  language: MetadataLanguage
  metadataAgents: Array<NamedMetadataAgent>
  name: string
  preferEmbeddedMetadata: boolean
  region: MetadataRegion
}

export interface PartialUpdateLibrary {
  combineFileScannerFields?: boolean
  combineMetadataAgentFields?: boolean
  fileScanners?: Array<FileScanner>
  folders?: Array<string>
  icon?: string | null
  language?: MetadataLanguage
  metadataAgents?: Array<NamedMetadataAgent>
  name?: string
  preferEmbeddedMetadata?: boolean
  region?: MetadataRegion
}

export interface Author {
  biography: string | null
  birthDate: number | null
  bornIn: string | null
  deathDate: number | null
  id: UUID
  imageID: UUID | null
  libraryId: UUID
  name: string
  provider: string | null
  providerID: string | null
  website: string | null
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
  coverID: UUID | null
  description: string | null
  durationMs: number
  genres: Array<string>
  id: UUID
  isbn: string | null
  language: MetadataLanguage | null
  libraryId: UUID
  narrators: Array<string>
  positionMs: number
  provider: string | null
  providerID: string | null
  providerRating: number | null
  publisher: string | null
  releaseDate: number | null
  series: Array<TitledId>
  status: PlayStatus
  title: string
}

export interface Series {
  authors: Array<NamedId>
  bookCoverIDs: Array<UUID>
  coverID: UUID | null
  description: string | null
  genres: Array<string>
  id: UUID
  libraryId: UUID
  primaryWorks: number | null
  provider: string | null
  providerID: string | null
  title: string
  totalBooks: number | null
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

export interface Chapter {
  endMs: number
  startMs: number
  title: string | null
  trackId: UUID
}

export type BookField =
  | "TITLE"
  | "AUTHORS"
  | "SERIES"
  | "PROVIDER"
  | "PROVIDER_ID"
  | "PROVIDER_RATING"
  | "RELEASE_DATE"
  | "PUBLISHER"
  | "LANGUAGE"
  | "DESCRIPTION"
  | "NARRATORS"
  | "GENRES"
  | "ISBN"
  | "COVER_ID"
  | "CHAPTERS"

export interface Track {
  book: TitledId
  durationMs: number
  fileModifiedAt: number
  id: UUID
  title: string
  trackNr: number
}

export interface BookDetailed extends Book {
  chapters: Array<Chapter>
  overridden: Array<BookField>
  tracks: Array<Track>
}

export interface ChapterMark {
  startMs: number
  title: string | null
}

export interface BookUpdate {
  authors?: Array<UUID>
  chapters?: Array<ChapterMark>
  cover?: string | null
  description?: string | null
  genres?: Array<string> | null
  isbn?: string | null
  language?: MetadataLanguage | null
  narrators?: Array<string> | null
  provider?: string | null
  providerID?: string | null
  providerRating?: number | null
  publisher?: string | null
  releaseDate?: number | null
  reset?: Array<BookField>
  series?: Array<UUID> | null
  title?: string
}

export type SeriesField =
  "TITLE" | "PROVIDER" | "PROVIDER_ID" | "TOTAL_BOOKS" | "PRIMARY_WORKS" | "COVER_ID" | "DESCRIPTION"

export interface YearRange {
  end: number
  start: number
}

export interface SeriesDetailed extends Series {
  books: Array<Book>
  narrators: Array<string>
  overridden: Array<SeriesField>
  yearRange: YearRange | null
}

export interface SeriesCreate {
  title: string
}

export interface SeriesUpdate {
  books?: Array<UUID>
  cover?: string | null
  description?: string | null
  primaryWorks?: number | null
  provider?: string | null
  providerID?: string | null
  reset?: Array<SeriesField>
  title?: string
  totalBooks?: number | null
}

export type AuthorField =
  "NAME" | "PROVIDER" | "PROVIDER_ID" | "BIOGRAPHY" | "IMAGE_ID" | "WEBSITE" | "BORN_IN" | "BIRTH_DATE" | "DEATH_DATE"

export interface AuthorDetailed extends Author {
  books: Array<Book>
  overridden: Array<AuthorField>
  series: Array<Series>
}

export interface AuthorCreate {
  name: string
}

export interface AuthorUpdate {
  biography?: string | null
  birthDate?: number | null
  books?: Array<UUID>
  bornIn?: string | null
  deathDate?: number | null
  image?: string | null
  name?: string
  provider?: string | null
  providerID?: string | null
  reset?: Array<AuthorField>
  website?: string | null
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
  name: string | null
}

export interface MetadataAuthor extends MetadataSearchAuthor {
  biography: string | null
  birthDate: number | null
  bornIn: string | null
  deathDate: number | null
  imageURL: string | null
  website: string | null
}

export interface MetadataBookSeries {
  id: MetadataAgentID
  index: number | null
  link: string
  title: string | null
}

export interface MetadataSearchBook {
  authors: Array<MetadataSearchAuthor> | null
  coverURL: string | null
  id: MetadataAgentID
  language: MetadataLanguage | null
  link: string | null
  narrators: Array<string>
  releaseDate: number | null
  series: Array<MetadataBookSeries>
  title: string | null
}

export interface MetadataBook extends MetadataSearchBook {
  description: string | null
  isbn: string | null
  providerRating: number | null
  publisher: string | null
}

export interface MetadataChapters {
  chapters: Array<ChapterMark>
  runtimeMs: number
}

export type MetadataSearchCount = "Small" | "Medium" | "Large" | "ExtraLarge"

export interface MetadataSeries {
  authors: Array<string> | null
  books: Array<MetadataSearchBook> | null
  coverURL: string | null
  description: string | null
  id: MetadataAgentID
  link: string
  primaryWorks: number | null
  title: string | null
  totalBooks: number | null
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

export interface ApiVersion {
  version: string
}

export interface ThirdPartyLicense {
  license: string
  licenseUrl: string | null
  name: string
  repository: string | null
  text: string | null
  version: string
}
