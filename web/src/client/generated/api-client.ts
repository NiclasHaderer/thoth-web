/* eslint-disable */
// noinspection JSUnusedGlobalSymbols,ES6UnusedImports
// noinspection ES6UnusedImports
// @ts-nocheck
import { ApiCallData, ApiInterceptor, ApiResponse, _request, _createUrl, _mergeHeaders } from "./client"
import type {
  Author,
  AuthorCreate,
  AuthorDetailed,
  AuthorUpdate,
  Book,
  BookDetailed,
  BookUpdate,
  Empty,
  FileScanner,
  FileSystemItem,
  Genre,
  GenreDetailed,
  JWK,
  Library,
  LibraryPermissionLevel,
  LibraryPermissions,
  LibrarySearchResult,
  MetadataAgentApiModel,
  MetadataAgentID,
  MetadataAuthor,
  MetadataBook,
  MetadataBookSeries,
  MetadataLanguage,
  MetadataSearchAuthor,
  MetadataSearchBook,
  MetadataSearchCount,
  MetadataSeries,
  NamedId,
  NamedMetadataAgent,
  Narrator,
  NarratorDetailed,
  Order,
  PaginatedResponse,
  PartialUpdateLibrary,
  Position,
  Series,
  SeriesCreate,
  SeriesDetailed,
  SeriesUpdate,
  ThirdPartyLicense,
  ThothAccessToken,
  ThothChangePassword,
  ThothJWKs,
  ThothLoginUser,
  ThothModifyPermissions,
  ThothRegisterUser,
  ThothRenameUser,
  ThothUser,
  ThothUserWithPermissions,
  TitledId,
  Track,
  UUID,
  UpdateLibrary,
  UpdateLibraryPermissions,
  UpdateUserPermissions,
  UserPermissions,
  YearRange,
} from "./models"

export const createApi = (
  defaultHeaders: HeadersInit = {},
  defaultInterceptors: ApiInterceptor[] = [],
  executor = (callData: ApiCallData) =>
    fetch(callData.route, {
      method: callData.method,
      headers: callData.headers,
      body: callData.bodySerializer(callData.body),
    })
) => {
  const defaultHeadersImpl = new Headers(defaultHeaders)
  return {
    loginUser: (
      body: ThothLoginUser,
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<ThothAccessToken>> => {
      return _request(
        `/api/auth/login`,
        "POST",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        body,
        [...defaultInterceptors, ...interceptors],
        executor,
        false
      )
    },
    logoutUser: (headers: HeadersInit = {}, interceptors: ApiInterceptor[] = []): Promise<ApiResponse<Empty>> => {
      return _request(
        `/api/auth/logout`,
        "POST",
        "text",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        false
      )
    },
    registerUser: (
      body: ThothRegisterUser,
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<ThothUser>> => {
      return _request(
        `/api/auth/register`,
        "POST",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        body,
        [...defaultInterceptors, ...interceptors],
        executor,
        false
      )
    },
    retrieveJwks: (headers: HeadersInit = {}, interceptors: ApiInterceptor[] = []): Promise<ApiResponse<ThothJWKs>> => {
      return _request(
        `/api/auth/jwks.json`,
        "GET",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        false
      )
    },
    updatePermissions: (
      { id }: { id: UUID },
      body: ThothModifyPermissions<UpdateUserPermissions>,
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<ThothUser>> => {
      return _request(
        `/api/auth/user/${id}/permissions`,
        "PUT",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        body,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    getUser: (
      { id }: { id: UUID },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<ThothUser>> => {
      return _request(
        `/api/auth/user/${id}`,
        "GET",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    deleteUser: (
      { id }: { id: UUID },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Empty>> => {
      return _request(
        `/api/auth/user/${id}`,
        "DELETE",
        "text",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    getCurrentUser: (
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<ThothUserWithPermissions<UserPermissions>>> => {
      return _request(
        `/api/auth/user/current`,
        "GET",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    listUsers: (
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Array<ThothUserWithPermissions<UserPermissions>>>> => {
      return _request(
        `/api/auth/user`,
        "GET",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    updateUsername: (
      { id }: { id: UUID },
      body: ThothRenameUser,
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<ThothUser>> => {
      return _request(
        `/api/auth/user/${id}/username`,
        "POST",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        body,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    updatePassword: (
      { id }: { id: UUID },
      body: ThothChangePassword,
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Empty>> => {
      return _request(
        `/api/auth/user/${id}/password`,
        "POST",
        "text",
        _mergeHeaders(defaultHeadersImpl, headers),
        body,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    refreshAccessToken: (
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<ThothAccessToken>> => {
      return _request(
        `/api/auth/user/refresh`,
        "POST",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        false
      )
    },
    listFoldersAtACertainPath: (
      { path, showHidden }: { path: string; showHidden?: boolean },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Array<FileSystemItem>>> => {
      return _request(
        _createUrl(`/api/fs`, { path, showHidden }),
        "GET",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    listLibraries: (
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Array<Library>>> => {
      return _request(
        `/api/libraries`,
        "GET",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    createLibrary: (
      body: UpdateLibrary,
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Library>> => {
      return _request(
        `/api/libraries`,
        "POST",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        body,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    getLibrary: (
      { libraryId }: { libraryId: UUID },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Library>> => {
      return _request(
        `/api/libraries/${libraryId}`,
        "GET",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    updateLibrary: (
      { libraryId }: { libraryId: UUID },
      body: PartialUpdateLibrary,
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Library>> => {
      return _request(
        `/api/libraries/${libraryId}`,
        "PATCH",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        body,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    deleteLibrary: (
      { libraryId }: { libraryId: UUID },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Empty>> => {
      return _request(
        `/api/libraries/${libraryId}`,
        "DELETE",
        "text",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    rescanLibrary: (
      { libraryId }: { libraryId: UUID },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Empty>> => {
      return _request(
        `/api/libraries/${libraryId}/rescan`,
        "POST",
        "text",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    searchInAllLibraries: (
      { author, book, q, series }: { author?: string; book?: string; q?: string; series?: string },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<LibrarySearchResult>> => {
      return _request(
        _createUrl(`/api/libraries/search`, { author, book, q, series }),
        "GET",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    listFileScanners: (
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Array<FileScanner>>> => {
      return _request(
        `/api/scanners`,
        "GET",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    listMetadataAgents: (
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Array<MetadataAgentApiModel>>> => {
      return _request(
        `/api/metadata-agents`,
        "GET",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    listBooks: (
      { limit, offset, order, libraryId }: { limit?: number; offset?: number; order?: Order; libraryId: UUID },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<PaginatedResponse<Book>>> => {
      return _request(
        _createUrl(`/api/libraries/${libraryId}/books`, { limit, offset, order }),
        "GET",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    listBookSorting: (
      { limit, offset, order, libraryId }: { limit?: number; offset?: number; order?: Order; libraryId: UUID },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Array<UUID>>> => {
      return _request(
        _createUrl(`/api/libraries/${libraryId}/books/sorting`, { limit, offset, order }),
        "GET",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    getBookPosition: (
      { order, id, libraryId }: { order?: Order; id: UUID; libraryId: UUID },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Position>> => {
      return _request(
        _createUrl(`/api/libraries/${libraryId}/books/${id}/position`, { order }),
        "GET",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    getBook: (
      { id, libraryId }: { id: UUID; libraryId: UUID },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<BookDetailed>> => {
      return _request(
        `/api/libraries/${libraryId}/books/${id}`,
        "GET",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    updateBook: (
      { id, libraryId }: { id: UUID; libraryId: UUID },
      body: BookUpdate,
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Book>> => {
      return _request(
        `/api/libraries/${libraryId}/books/${id}`,
        "PATCH",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        body,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    getBookAutocomplete: (
      { q, libraryId }: { q: string; libraryId: UUID },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Array<TitledId>>> => {
      return _request(
        _createUrl(`/api/libraries/${libraryId}/books/autocomplete`, { q }),
        "GET",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    autoMatchBook: (
      { id, libraryId }: { id: UUID; libraryId: UUID },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Book>> => {
      return _request(
        `/api/libraries/${libraryId}/books/${id}/automatch`,
        "POST",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    listSeries: (
      { limit, offset, order, libraryId }: { limit?: number; offset?: number; order?: Order; libraryId: UUID },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<PaginatedResponse<Series>>> => {
      return _request(
        _createUrl(`/api/libraries/${libraryId}/series`, { limit, offset, order }),
        "GET",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    createSeries: (
      { libraryId }: { libraryId: UUID },
      body: SeriesCreate,
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<SeriesDetailed>> => {
      return _request(
        `/api/libraries/${libraryId}/series`,
        "POST",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        body,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    listSeriesSorting: (
      { limit, offset, order, libraryId }: { limit?: number; offset?: number; order?: Order; libraryId: UUID },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Array<UUID>>> => {
      return _request(
        _createUrl(`/api/libraries/${libraryId}/series/sorting`, { limit, offset, order }),
        "GET",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    getSeriesPosition: (
      { order, id, libraryId }: { order?: Order; id: UUID; libraryId: UUID },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Position>> => {
      return _request(
        _createUrl(`/api/libraries/${libraryId}/series/${id}/position`, { order }),
        "GET",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    getSeries: (
      { id, libraryId }: { id: UUID; libraryId: UUID },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<SeriesDetailed>> => {
      return _request(
        `/api/libraries/${libraryId}/series/${id}`,
        "GET",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    updateSeries: (
      { id, libraryId }: { id: UUID; libraryId: UUID },
      body: SeriesUpdate,
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Series>> => {
      return _request(
        `/api/libraries/${libraryId}/series/${id}`,
        "PATCH",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        body,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    getSeriesAutocomplete: (
      { q, libraryId }: { q: string; libraryId: UUID },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Array<TitledId>>> => {
      return _request(
        _createUrl(`/api/libraries/${libraryId}/series/autocomplete`, { q }),
        "GET",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    autoMatchSeries: (
      { id, libraryId }: { id: UUID; libraryId: UUID },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Series>> => {
      return _request(
        `/api/libraries/${libraryId}/series/${id}/automatch`,
        "POST",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    listAuthors: (
      { limit, offset, order, libraryId }: { limit?: number; offset?: number; order?: Order; libraryId: UUID },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<PaginatedResponse<Author>>> => {
      return _request(
        _createUrl(`/api/libraries/${libraryId}/authors`, { limit, offset, order }),
        "GET",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    createAuthor: (
      { libraryId }: { libraryId: UUID },
      body: AuthorCreate,
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<AuthorDetailed>> => {
      return _request(
        `/api/libraries/${libraryId}/authors`,
        "POST",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        body,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    listAuthorSorting: (
      { limit, offset, order, libraryId }: { limit?: number; offset?: number; order?: Order; libraryId: UUID },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Array<UUID>>> => {
      return _request(
        _createUrl(`/api/libraries/${libraryId}/authors/sorting`, { limit, offset, order }),
        "GET",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    getAuthorPosition: (
      { order, id, libraryId }: { order?: Order; id: UUID; libraryId: UUID },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Position>> => {
      return _request(
        _createUrl(`/api/libraries/${libraryId}/authors/${id}/position`, { order }),
        "GET",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    getAuthor: (
      { id, libraryId }: { id: UUID; libraryId: UUID },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<AuthorDetailed>> => {
      return _request(
        `/api/libraries/${libraryId}/authors/${id}`,
        "GET",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    updateAuthor: (
      { id, libraryId }: { id: UUID; libraryId: UUID },
      body: AuthorUpdate,
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Author>> => {
      return _request(
        `/api/libraries/${libraryId}/authors/${id}`,
        "PATCH",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        body,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    getAuthorAutocomplete: (
      { q, libraryId }: { q: string; libraryId: UUID },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Array<NamedId>>> => {
      return _request(
        _createUrl(`/api/libraries/${libraryId}/authors/autocomplete`, { q }),
        "GET",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    autoMatchAuthor: (
      { id, libraryId }: { id: UUID; libraryId: UUID },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Author>> => {
      return _request(
        `/api/libraries/${libraryId}/authors/${id}/automatch`,
        "POST",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    listNarrators: (
      { limit, offset, order, libraryId }: { limit?: number; offset?: number; order?: Order; libraryId: UUID },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<PaginatedResponse<Narrator>>> => {
      return _request(
        _createUrl(`/api/libraries/${libraryId}/narrators`, { limit, offset, order }),
        "GET",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    getNarrator: (
      { name, libraryId }: { name: string; libraryId: UUID },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<NarratorDetailed>> => {
      return _request(
        `/api/libraries/${libraryId}/narrators/${name}`,
        "GET",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    listGenres: (
      { limit, offset, order, libraryId }: { limit?: number; offset?: number; order?: Order; libraryId: UUID },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<PaginatedResponse<Genre>>> => {
      return _request(
        _createUrl(`/api/libraries/${libraryId}/genres`, { limit, offset, order }),
        "GET",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    getGenre: (
      { name, libraryId }: { name: string; libraryId: UUID },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<GenreDetailed>> => {
      return _request(
        `/api/libraries/${libraryId}/genres/${name}`,
        "GET",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    searchMetadata: (
      {
        author,
        keywords,
        language,
        narrator,
        pageSize,
        title,
        libraryId,
      }: {
        author?: string
        keywords?: string
        language?: MetadataLanguage
        narrator?: string
        pageSize?: MetadataSearchCount
        title?: string
        libraryId: UUID
      },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Array<MetadataSearchBook>>> => {
      return _request(
        _createUrl(`/api/libraries/${libraryId}/metadata/search`, {
          author,
          keywords,
          language,
          narrator,
          pageSize,
          title,
        }),
        "GET",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    getAuthorMetadata: (
      { provider, id, libraryId }: { provider: string; id: string; libraryId: UUID },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<MetadataAuthor>> => {
      return _request(
        _createUrl(`/api/libraries/${libraryId}/metadata/author/${id}`, { provider }),
        "GET",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    searchAuthorMetadata: (
      { q, libraryId }: { q: string; libraryId: UUID },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Array<MetadataAuthor>>> => {
      return _request(
        _createUrl(`/api/libraries/${libraryId}/metadata/author/search`, { q }),
        "GET",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    getBookMetadata: (
      { provider, id, libraryId }: { provider: string; id: string; libraryId: UUID },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<MetadataBook>> => {
      return _request(
        _createUrl(`/api/libraries/${libraryId}/metadata/book/${id}`, { provider }),
        "GET",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    searchBookMetadata: (
      { authorName, q, libraryId }: { authorName?: string; q: string; libraryId: UUID },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Array<MetadataBook>>> => {
      return _request(
        _createUrl(`/api/libraries/${libraryId}/metadata/book/search`, { authorName, q }),
        "GET",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    getSeriesMetadata: (
      { provider, id, libraryId }: { provider: string; id: string; libraryId: UUID },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<MetadataSeries>> => {
      return _request(
        _createUrl(`/api/libraries/${libraryId}/metadata/series/${id}`, { provider }),
        "GET",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    searchSeriesMetadata: (
      { authorName, q, libraryId }: { authorName?: string; q: string; libraryId: UUID },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Array<MetadataSeries>>> => {
      return _request(
        _createUrl(`/api/libraries/${libraryId}/metadata/series/search`, { authorName, q }),
        "GET",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    getAudioFile: (
      { id }: { id: UUID },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Blob>> => {
      return _request(
        `/api/stream/audio/${id}`,
        "GET",
        "blob",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    getImageFile: (
      { id }: { id: UUID },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Blob>> => {
      return _request(
        `/api/stream/images/${id}`,
        "GET",
        "blob",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    pingServer: (headers: HeadersInit = {}, interceptors: ApiInterceptor[] = []): Promise<ApiResponse<Empty>> => {
      return _request(
        `/api/ping`,
        "POST",
        "text",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        false
      )
    },
    listThirdPartyLicenses: (
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Array<ThirdPartyLicense>>> => {
      return _request(
        `/api/licenses`,
        "GET",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
  } as const
}
