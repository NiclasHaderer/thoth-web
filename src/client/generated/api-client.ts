// noinspection JSUnusedGlobalSymbols,ES6UnusedImports
import { ApiCallData, ApiInterceptor, ApiResponse, _request, _createUrl, _mergeHeaders } from "./client"
import type {
  AuthorApiModel,
  AuthorModel,
  BookApiModel,
  BookModel,
  DetailedAuthorModel,
  DetailedBookModel,
  DetailedSeriesModel,
  Empty,
  FileScanner,
  FileSystemItem,
  JWK,
  JWKs,
  LibraryApiModel,
  LibraryModel,
  LibraryPermissionsModel,
  MetadataAgent,
  MetadataAgentApiModel,
  MetadataAuthor,
  MetadataBook,
  MetadataBookSeries,
  MetadataLanguage,
  MetadataProviderWithID,
  MetadataSearchAuthor,
  MetadataSearchBook,
  MetadataSearchCount,
  MetadataSeries,
  NamedId,
  Order,
  PaginatedResponse,
  PartialAuthorApiModel,
  PartialBookApiModel,
  PartialLibraryApiModel,
  PartialSeriesApiModel,
  Position,
  SearchModel,
  SeriesApiModel,
  SeriesModel,
  ThothAccessToken,
  ThothChangePassword,
  ThothLoginUser,
  ThothModifyPermissions,
  ThothRegisterUser,
  ThothRenameUser,
  ThothUser,
  ThothUserPermissions,
  TitledId,
  TrackModel,
  UUID,
  UserPermissionsModel,
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
    loginUser(
      body: ThothLoginUser,
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<ThothAccessToken>> {
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
    logoutUser(headers: HeadersInit = {}, interceptors: ApiInterceptor[] = []): Promise<ApiResponse<Empty>> {
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
    registerUser(
      body: ThothRegisterUser,
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<ThothUser<UUID, UserPermissionsModel>>> {
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
    retrieveJwks(headers: HeadersInit = {}, interceptors: ApiInterceptor[] = []): Promise<ApiResponse<JWKs>> {
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
    updatePermissions(
      { id }: { id: UUID },
      body: ThothModifyPermissions<UserPermissionsModel>,
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<ThothUser<UUID, UserPermissionsModel>>> {
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
    getUser(
      { id }: { id: UUID },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<ThothUser<UUID, UserPermissionsModel>>> {
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
    deleteUser(
      { id }: { id: UUID },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Empty>> {
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
    getCurrentUser(
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<ThothUser<UUID, UserPermissionsModel>>> {
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
    listUsers(
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Array<ThothUser<UUID, UserPermissionsModel>>>> {
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
    updateUsername(
      { id }: { id: UUID },
      body: ThothRenameUser,
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<ThothUser<UUID, UserPermissionsModel>>> {
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
    updatePassword(
      { id }: { id: UUID },
      body: ThothChangePassword,
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Empty>> {
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
    refreshAccessToken(
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<ThothAccessToken>> {
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
    listFoldersAtACertainPath(
      { path, showHidden }: { path: string; showHidden?: boolean },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Array<FileSystemItem>>> {
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
    listLibraries(
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Array<LibraryModel>>> {
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
    createLibrary(
      body: LibraryApiModel,
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<LibraryModel>> {
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
    getLibrary(
      { libraryId }: { libraryId: UUID },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<LibraryModel>> {
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
    replaceLibrary(
      { libraryId }: { libraryId: UUID },
      body: LibraryApiModel,
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<LibraryModel>> {
      return _request(
        `/api/libraries/${libraryId}`,
        "PUT",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        body,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    updateLibrary(
      { libraryId }: { libraryId: UUID },
      body: PartialLibraryApiModel,
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<LibraryModel>> {
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
    rescanLibrary(
      { libraryId }: { libraryId: UUID },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Empty>> {
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
    rescanAllLibraries(headers: HeadersInit = {}, interceptors: ApiInterceptor[] = []): Promise<ApiResponse<Empty>> {
      return _request(
        `/api/libraries/rescan`,
        "POST",
        "text",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    searchInAllLibraries(
      { author, book, q, series }: { author?: string; book?: string; q?: string; series?: string },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<SearchModel>> {
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
    listFileScanners(
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Array<FileScanner>>> {
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
    listMetadataAgents(
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Array<MetadataAgentApiModel>>> {
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
    listBooks(
      { limit, offset, libraryId }: { limit?: number; offset?: number; libraryId: UUID },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<PaginatedResponse<BookModel>>> {
      return _request(
        _createUrl(`/api/libraries/${libraryId}/books`, { limit, offset }),
        "GET",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    listBookSorting(
      { limit, offset, libraryId }: { limit?: number; offset?: number; libraryId: UUID },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Array<UUID>>> {
      return _request(
        _createUrl(`/api/libraries/${libraryId}/books/sorting`, { limit, offset }),
        "GET",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    getBookPosition(
      { id, libraryId }: { id: UUID; libraryId: UUID },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Position>> {
      return _request(
        `/api/libraries/${libraryId}/books/${id}/position`,
        "GET",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    getBook(
      { id, libraryId }: { id: UUID; libraryId: UUID },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<DetailedBookModel>> {
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
    updateBook(
      { id, libraryId }: { id: UUID; libraryId: UUID },
      body: PartialBookApiModel,
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<BookModel>> {
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
    replaceBook(
      { id, libraryId }: { id: UUID; libraryId: UUID },
      body: BookApiModel,
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<BookModel>> {
      return _request(
        `/api/libraries/${libraryId}/books/${id}`,
        "PUT",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        body,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    getBookAutocomplete(
      { q, libraryId }: { q: string; libraryId: UUID },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Array<TitledId>>> {
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
    autoMatchBook(
      { id, libraryId }: { id: UUID; libraryId: UUID },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<BookModel>> {
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
    listSeries(
      { limit, offset, libraryId }: { limit?: number; offset?: number; libraryId: UUID },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<PaginatedResponse<SeriesModel>>> {
      return _request(
        _createUrl(`/api/libraries/${libraryId}/series`, { limit, offset }),
        "GET",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    listSeriesSorting(
      { limit, offset, order, libraryId }: { limit?: number; offset?: number; order?: Order; libraryId: UUID },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Array<UUID>>> {
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
    getSeriesPosition(
      { order, id, libraryId }: { order?: Order; id: UUID; libraryId: UUID },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Position>> {
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
    getSeries(
      { id, libraryId }: { id: UUID; libraryId: UUID },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<DetailedSeriesModel>> {
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
    updateSeries(
      { id, libraryId }: { id: UUID; libraryId: UUID },
      body: PartialSeriesApiModel,
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<SeriesModel>> {
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
    replaceSeries(
      { id, libraryId }: { id: UUID; libraryId: UUID },
      body: SeriesApiModel,
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<SeriesModel>> {
      return _request(
        `/api/libraries/${libraryId}/series/${id}`,
        "PUT",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        body,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    getSeriesAutocomplete(
      { q, libraryId }: { q: string; libraryId: UUID },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Array<TitledId>>> {
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
    listAuthors(
      { limit, offset, order, libraryId }: { limit?: number; offset?: number; order?: Order; libraryId: UUID },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<PaginatedResponse<AuthorModel>>> {
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
    listAuthorSorting(
      { limit, offset, order, libraryId }: { limit?: number; offset?: number; order?: Order; libraryId: UUID },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Array<UUID>>> {
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
    getAuthorPosition(
      { order, id, libraryId }: { order?: Order; id: UUID; libraryId: UUID },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Position>> {
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
    getAuthor(
      { id, libraryId }: { id: UUID; libraryId: UUID },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<DetailedAuthorModel>> {
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
    updateAuthor(
      { id, libraryId }: { id: UUID; libraryId: UUID },
      body: PartialAuthorApiModel,
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<AuthorModel>> {
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
    replaceAuthor(
      { id, libraryId }: { id: UUID; libraryId: UUID },
      body: AuthorApiModel,
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<AuthorModel>> {
      return _request(
        `/api/libraries/${libraryId}/authors/${id}`,
        "PUT",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        body,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    getAuthorAutocomplete(
      { q, libraryId }: { q: string; libraryId: UUID },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Array<NamedId>>> {
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
    searchMetadata(
      {
        author,
        keywords,
        language,
        narrator,
        pageSize,
        region,
        title,
      }: {
        author?: string
        keywords?: string
        language?: MetadataLanguage
        narrator?: string
        pageSize?: MetadataSearchCount
        region: string
        title?: string
      },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Array<MetadataSearchBook>>> {
      return _request(
        _createUrl(`/api/metadata/search`, { author, keywords, language, narrator, pageSize, region, title }),
        "GET",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    getAuthorMetadata(
      { provider, region, id }: { provider: string; region: string; id: string },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<MetadataAuthor>> {
      return _request(
        _createUrl(`/api/metadata/author/${id}`, { provider, region }),
        "GET",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    searchAuthorMetadata(
      { q, region }: { q: string; region: string },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Array<MetadataAuthor>>> {
      return _request(
        _createUrl(`/api/metadata/author/search`, { q, region }),
        "GET",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    getBookMetadata(
      { provider, region, id }: { provider: string; region: string; id: string },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<MetadataBook>> {
      return _request(
        _createUrl(`/api/metadata/book/${id}`, { provider, region }),
        "GET",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    searchBookMetadata(
      { authorName, q, region }: { authorName?: string; q: string; region: string },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Array<MetadataBook>>> {
      return _request(
        _createUrl(`/api/metadata/book/search`, { authorName, q, region }),
        "GET",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    getSeriesMetadata(
      { provider, region, id }: { provider: string; region: string; id: string },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<MetadataSeries>> {
      return _request(
        _createUrl(`/api/metadata/series/${id}`, { provider, region }),
        "GET",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    searchSeriesMetadata(
      { authorName, q, region }: { authorName?: string; q: string; region: string },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Array<MetadataSeries>>> {
      return _request(
        _createUrl(`/api/metadata/series/search`, { authorName, q, region }),
        "GET",
        "json",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    getAudioFile(
      { id }: { id: UUID },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Blob>> {
      return _request(
        `/api/stream/audio/${id}`,
        "GET",
        "blob",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        false
      )
    },
    getImageFile(
      { id }: { id: UUID },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Blob>> {
      return _request(
        `/api/stream/images/${id}`,
        "GET",
        "blob",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        false
      )
    },
    pingServer(headers: HeadersInit = {}, interceptors: ApiInterceptor[] = []): Promise<ApiResponse<Empty>> {
      return _request(
        `/api/ping`,
        "POST",
        "text",
        _mergeHeaders(defaultHeadersImpl, headers),
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
  } as const
}
