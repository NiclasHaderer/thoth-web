import type {
  ApiCallData,
  ApiInterceptor,
  ApiResponse,
  AuthorApiModel,
  AuthorModel,
  BookApiModel,
  BookModel,
  DetailedAuthorModel,
  DetailedBookModel,
  DetailedSeriesModel,
  FileScanner,
  FileSystemItem,
  JWKsResponse,
  JwtPair,
  LibraryApiModel,
  LibraryModel,
  LoginUser,
  MetadataAgentApiModel,
  MetadataAuthor,
  MetadataBook,
  MetadataLanguage,
  MetadataSearchBook,
  MetadataSearchCount,
  MetadataSeries,
  ModifyUser,
  NamedId,
  Order,
  PaginatedResponse,
  PartialAuthorApiModel,
  PartialBookApiModel,
  PartialLibraryApiModel,
  PartialSeriesApiModel,
  PasswordChange,
  Position,
  RegisterUser,
  SearchModel,
  SeriesApiModel,
  SeriesModel,
  TitledId,
  Unit,
  UserModel,
  UsernameChange,
  UUID,
} from "./models/api-models"

type ArrayIsch<T> = T | T[]
const __createUrl = (
  route: string,
  params: Record<string, ArrayIsch<string | number | boolean | undefined | null>>
): string => {
  const finalUrlParams = new URLSearchParams()
  for (let [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      const newValue = value.filter(i => i !== "" && i !== undefined && i !== null) as (string | number | boolean)[]
      newValue.forEach(v => finalUrlParams.append(key, v.toString()))
    } else {
      if (value !== null && value !== undefined) {
        finalUrlParams.append(key, value.toString())
      }
    }
  }
  return finalUrlParams ? `${route}?${finalUrlParams.toString()}` : route
}
const __request = <T>(
  route: string,
  method: string,
  bodyParseMethod: "text" | "json" | "blob",
  _headers: HeadersInit,
  body?: object,
  interceptors?: ApiInterceptor[]
): Promise<ApiResponse<T>> => {
  const headers = new Headers(_headers)
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }
  let apiCallData: ApiCallData = {
    route,
    method,
    body,
    headers,
    bodySerializer: (body?: object) => (body ? JSON.stringify(body) : undefined),
    executor: (route: string, method: string, headers: Headers, body: string | undefined) =>
      fetch(route, { method, headers, body }),
  }
  if (interceptors) {
    for (const interceptor of interceptors) {
      apiCallData = interceptor(apiCallData)
    }
  }

  return apiCallData
    .executor(apiCallData.route, apiCallData.method, apiCallData.headers, apiCallData.bodySerializer(apiCallData.body))
    .then(async response => {
      if (!(response instanceof Response)) {
        return response
      }

      if (response.ok) {
        return {
          success: true,
          body: await response[bodyParseMethod](),
        } as const
      } else {
        return {
          success: false,
          status: response.status,
          error: await response
            .json()
            .catch(() => response.text())
            .catch(() => response.statusText),
        } as const
      }
    })
    .catch(error => ({ success: false, error: error?.toString() } as const))
}
export const Api = {
  loginUser(
    body: LoginUser,
    headers: HeadersInit = {},
    interceptors?: ApiInterceptor[]
  ): Promise<ApiResponse<JwtPair>> {
    const __finalUrl = `/api/auth/login`
    return __request(__finalUrl, "POST", "json", headers, body, interceptors)
  },
  registerUser(
    body: RegisterUser,
    headers: HeadersInit = {},
    interceptors?: ApiInterceptor[]
  ): Promise<ApiResponse<UserModel>> {
    const __finalUrl = `/api/auth/register`
    return __request(__finalUrl, "POST", "json", headers, body, interceptors)
  },
  retrieveJwks(headers: HeadersInit = {}, interceptors?: ApiInterceptor[]): Promise<ApiResponse<JWKsResponse>> {
    const __finalUrl = `/api/auth/.well-known/jwks.json`
    return __request(__finalUrl, "GET", "json", headers, undefined, interceptors)
  },
  updateUser(
    id: UUID,
    body: ModifyUser,
    headers: HeadersInit = {},
    interceptors?: ApiInterceptor[]
  ): Promise<ApiResponse<UserModel>> {
    const __finalUrl = __createUrl(`/api/auth/user/edit`, { id })
    return __request(__finalUrl, "PUT", "json", headers, body, interceptors)
  },
  listUsers(headers: HeadersInit = {}, interceptors?: ApiInterceptor[]): Promise<ApiResponse<UserModel>> {
    const __finalUrl = `/api/auth/user`
    return __request(__finalUrl, "GET", "json", headers, undefined, interceptors)
  },
  deleteUser(headers: HeadersInit = {}, interceptors?: ApiInterceptor[]): Promise<ApiResponse<Unit>> {
    const __finalUrl = `/api/auth/user`
    return __request(__finalUrl, "DELETE", "json", headers, undefined, interceptors)
  },
  updateUsername(
    body: UsernameChange,
    headers: HeadersInit = {},
    interceptors?: ApiInterceptor[]
  ): Promise<ApiResponse<UserModel>> {
    const __finalUrl = `/api/auth/user/username`
    return __request(__finalUrl, "POST", "json", headers, body, interceptors)
  },
  updatePassword(
    body: PasswordChange,
    headers: HeadersInit = {},
    interceptors?: ApiInterceptor[]
  ): Promise<ApiResponse<Unit>> {
    const __finalUrl = `/api/auth/user/password`
    return __request(__finalUrl, "POST", "json", headers, body, interceptors)
  },
  listFoldersAtACertainPath(
    path: string,
    headers: HeadersInit = {},
    interceptors?: ApiInterceptor[]
  ): Promise<ApiResponse<FileSystemItem[]>> {
    const __finalUrl = __createUrl(`/api/fs`, { path })
    return __request(__finalUrl, "GET", "json", headers, undefined, interceptors)
  },
  listLibraries(headers: HeadersInit = {}, interceptors?: ApiInterceptor[]): Promise<ApiResponse<LibraryModel[]>> {
    const __finalUrl = `/api/libraries`
    return __request(__finalUrl, "GET", "json", headers, undefined, interceptors)
  },
  createLibrary(
    body: LibraryApiModel,
    headers: HeadersInit = {},
    interceptors?: ApiInterceptor[]
  ): Promise<ApiResponse<LibraryModel>> {
    const __finalUrl = `/api/libraries`
    return __request(__finalUrl, "POST", "json", headers, body, interceptors)
  },
  getLibrary(
    libraryId: UUID,
    headers: HeadersInit = {},
    interceptors?: ApiInterceptor[]
  ): Promise<ApiResponse<LibraryModel>> {
    const __finalUrl = `/api/libraries/${libraryId}`
    return __request(__finalUrl, "GET", "json", headers, undefined, interceptors)
  },
  replaceLibrary(
    libraryId: UUID,
    body: LibraryApiModel,
    headers: HeadersInit = {},
    interceptors?: ApiInterceptor[]
  ): Promise<ApiResponse<LibraryModel>> {
    const __finalUrl = `/api/libraries/${libraryId}`
    return __request(__finalUrl, "PUT", "json", headers, body, interceptors)
  },
  updateLibrary(
    libraryId: UUID,
    body: PartialLibraryApiModel,
    headers: HeadersInit = {},
    interceptors?: ApiInterceptor[]
  ): Promise<ApiResponse<LibraryModel>> {
    const __finalUrl = `/api/libraries/${libraryId}`
    return __request(__finalUrl, "PATCH", "json", headers, body, interceptors)
  },
  rescanLibrary(
    libraryId: UUID,
    headers: HeadersInit = {},
    interceptors?: ApiInterceptor[]
  ): Promise<ApiResponse<Unit>> {
    const __finalUrl = `/api/libraries/${libraryId}/rescan`
    return __request(__finalUrl, "POST", "json", headers, undefined, interceptors)
  },
  rescanAllLibraries(headers: HeadersInit = {}, interceptors?: ApiInterceptor[]): Promise<ApiResponse<Unit>> {
    const __finalUrl = `/api/libraries/rescan`
    return __request(__finalUrl, "POST", "json", headers, undefined, interceptors)
  },
  searchInAllLibraries(
    author?: string,
    book?: string,
    q?: string,
    series?: string,
    headers: HeadersInit = {},
    interceptors?: ApiInterceptor[]
  ): Promise<ApiResponse<SearchModel>> {
    const __finalUrl = __createUrl(`/api/libraries/search`, { author, book, q, series })
    return __request(__finalUrl, "GET", "json", headers, undefined, interceptors)
  },
  listFileScanners(headers: HeadersInit = {}, interceptors?: ApiInterceptor[]): Promise<ApiResponse<FileScanner[]>> {
    const __finalUrl = `/api/scanners`
    return __request(__finalUrl, "GET", "json", headers, undefined, interceptors)
  },
  listMetadataAgents(
    headers: HeadersInit = {},
    interceptors?: ApiInterceptor[]
  ): Promise<ApiResponse<MetadataAgentApiModel[]>> {
    const __finalUrl = `/api/metadata-agents`
    return __request(__finalUrl, "GET", "json", headers, undefined, interceptors)
  },
  listBooks(
    libraryId: UUID,
    limit?: number,
    offset?: number,
    headers: HeadersInit = {},
    interceptors?: ApiInterceptor[]
  ): Promise<ApiResponse<PaginatedResponse<BookModel>>> {
    const __finalUrl = __createUrl(`/api/libraries/${libraryId}/books`, { limit, offset })
    return __request(__finalUrl, "GET", "json", headers, undefined, interceptors)
  },
  listBookSorting(
    libraryId: UUID,
    limit?: number,
    offset?: number,
    headers: HeadersInit = {},
    interceptors?: ApiInterceptor[]
  ): Promise<ApiResponse<UUID[]>> {
    const __finalUrl = __createUrl(`/api/libraries/${libraryId}/books/sorting`, { limit, offset })
    return __request(__finalUrl, "GET", "json", headers, undefined, interceptors)
  },
  getBookPosition(
    bookId: UUID,
    libraryId: UUID,
    headers: HeadersInit = {},
    interceptors?: ApiInterceptor[]
  ): Promise<ApiResponse<Position>> {
    const __finalUrl = `/api/libraries/${libraryId}/books/${bookId}/position`
    return __request(__finalUrl, "GET", "json", headers, undefined, interceptors)
  },
  getBook(
    bookId: UUID,
    libraryId: UUID,
    headers: HeadersInit = {},
    interceptors?: ApiInterceptor[]
  ): Promise<ApiResponse<DetailedBookModel>> {
    const __finalUrl = `/api/libraries/${libraryId}/books/${bookId}`
    return __request(__finalUrl, "GET", "json", headers, undefined, interceptors)
  },
  updateBook(
    bookId: UUID,
    libraryId: UUID,
    body: PartialBookApiModel,
    headers: HeadersInit = {},
    interceptors?: ApiInterceptor[]
  ): Promise<ApiResponse<BookModel>> {
    const __finalUrl = `/api/libraries/${libraryId}/books/${bookId}`
    return __request(__finalUrl, "PATCH", "json", headers, body, interceptors)
  },
  replaceBook(
    bookId: UUID,
    libraryId: UUID,
    body: BookApiModel,
    headers: HeadersInit = {},
    interceptors?: ApiInterceptor[]
  ): Promise<ApiResponse<BookModel>> {
    const __finalUrl = `/api/libraries/${libraryId}/books/${bookId}`
    return __request(__finalUrl, "PUT", "json", headers, body, interceptors)
  },
  getBookAutocomplete(
    libraryId: UUID,
    q: string,
    headers: HeadersInit = {},
    interceptors?: ApiInterceptor[]
  ): Promise<ApiResponse<TitledId[]>> {
    const __finalUrl = __createUrl(`/api/libraries/${libraryId}/books/autocomplete`, { q })
    return __request(__finalUrl, "GET", "json", headers, undefined, interceptors)
  },
  listSeries(
    libraryId: UUID,
    limit?: number,
    offset?: number,
    headers: HeadersInit = {},
    interceptors?: ApiInterceptor[]
  ): Promise<ApiResponse<PaginatedResponse<SeriesModel>>> {
    const __finalUrl = __createUrl(`/api/libraries/${libraryId}/series`, { limit, offset })
    return __request(__finalUrl, "GET", "json", headers, undefined, interceptors)
  },
  listSeriesSorting(
    libraryId: UUID,
    limit?: number,
    offset?: number,
    order?: Order,
    headers: HeadersInit = {},
    interceptors?: ApiInterceptor[]
  ): Promise<ApiResponse<UUID[]>> {
    const __finalUrl = __createUrl(`/api/libraries/${libraryId}/series/sorting`, { limit, offset, order })
    return __request(__finalUrl, "GET", "json", headers, undefined, interceptors)
  },
  getSeriesPosition(
    seriesId: UUID,
    libraryId: UUID,
    order?: Order,
    headers: HeadersInit = {},
    interceptors?: ApiInterceptor[]
  ): Promise<ApiResponse<Position>> {
    const __finalUrl = __createUrl(`/api/libraries/${libraryId}/series/${seriesId}/position`, { order })
    return __request(__finalUrl, "GET", "json", headers, undefined, interceptors)
  },
  getSeries(
    seriesId: UUID,
    libraryId: UUID,
    headers: HeadersInit = {},
    interceptors?: ApiInterceptor[]
  ): Promise<ApiResponse<DetailedSeriesModel>> {
    const __finalUrl = `/api/libraries/${libraryId}/series/${seriesId}`
    return __request(__finalUrl, "GET", "json", headers, undefined, interceptors)
  },
  updateSeries(
    seriesId: UUID,
    libraryId: UUID,
    body: PartialSeriesApiModel,
    headers: HeadersInit = {},
    interceptors?: ApiInterceptor[]
  ): Promise<ApiResponse<SeriesModel>> {
    const __finalUrl = `/api/libraries/${libraryId}/series/${seriesId}`
    return __request(__finalUrl, "PATCH", "json", headers, body, interceptors)
  },
  replaceSeries(
    seriesId: UUID,
    libraryId: UUID,
    body: SeriesApiModel,
    headers: HeadersInit = {},
    interceptors?: ApiInterceptor[]
  ): Promise<ApiResponse<SeriesModel>> {
    const __finalUrl = `/api/libraries/${libraryId}/series/${seriesId}`
    return __request(__finalUrl, "PUT", "json", headers, body, interceptors)
  },
  getSeriesAutocomplete(
    libraryId: UUID,
    q: string,
    headers: HeadersInit = {},
    interceptors?: ApiInterceptor[]
  ): Promise<ApiResponse<TitledId[]>> {
    const __finalUrl = __createUrl(`/api/libraries/${libraryId}/series/autocomplete`, { q })
    return __request(__finalUrl, "GET", "json", headers, undefined, interceptors)
  },
  listAuthors(
    libraryId: UUID,
    limit?: number,
    offset?: number,
    order?: Order,
    headers: HeadersInit = {},
    interceptors?: ApiInterceptor[]
  ): Promise<ApiResponse<PaginatedResponse<AuthorModel>>> {
    const __finalUrl = __createUrl(`/api/libraries/${libraryId}/authors`, { limit, offset, order })
    return __request(__finalUrl, "GET", "json", headers, undefined, interceptors)
  },
  listAuthorSorting(
    libraryId: UUID,
    limit?: number,
    offset?: number,
    order?: Order,
    headers: HeadersInit = {},
    interceptors?: ApiInterceptor[]
  ): Promise<ApiResponse<UUID[]>> {
    const __finalUrl = __createUrl(`/api/libraries/${libraryId}/authors/sorting`, { limit, offset, order })
    return __request(__finalUrl, "GET", "json", headers, undefined, interceptors)
  },
  getAuthorPosition(
    authorId: UUID,
    libraryId: UUID,
    order?: Order,
    headers: HeadersInit = {},
    interceptors?: ApiInterceptor[]
  ): Promise<ApiResponse<Position>> {
    const __finalUrl = __createUrl(`/api/libraries/${libraryId}/authors/${authorId}/position`, { order })
    return __request(__finalUrl, "GET", "json", headers, undefined, interceptors)
  },
  getAuthor(
    authorId: UUID,
    libraryId: UUID,
    headers: HeadersInit = {},
    interceptors?: ApiInterceptor[]
  ): Promise<ApiResponse<DetailedAuthorModel>> {
    const __finalUrl = `/api/libraries/${libraryId}/authors/${authorId}`
    return __request(__finalUrl, "GET", "json", headers, undefined, interceptors)
  },
  updateAuthor(
    authorId: UUID,
    libraryId: UUID,
    body: PartialAuthorApiModel,
    headers: HeadersInit = {},
    interceptors?: ApiInterceptor[]
  ): Promise<ApiResponse<AuthorModel>> {
    const __finalUrl = `/api/libraries/${libraryId}/authors/${authorId}`
    return __request(__finalUrl, "PATCH", "json", headers, body, interceptors)
  },
  replaceAuthor(
    authorId: UUID,
    libraryId: UUID,
    body: AuthorApiModel,
    headers: HeadersInit = {},
    interceptors?: ApiInterceptor[]
  ): Promise<ApiResponse<AuthorModel>> {
    const __finalUrl = `/api/libraries/${libraryId}/authors/${authorId}`
    return __request(__finalUrl, "PUT", "json", headers, body, interceptors)
  },
  getAuthorAutocomplete(
    libraryId: UUID,
    q: string,
    headers: HeadersInit = {},
    interceptors?: ApiInterceptor[]
  ): Promise<ApiResponse<NamedId[]>> {
    const __finalUrl = __createUrl(`/api/libraries/${libraryId}/authors/autocomplete`, { q })
    return __request(__finalUrl, "GET", "json", headers, undefined, interceptors)
  },
  searchMetadata(
    region: string,
    author?: string,
    keywords?: string,
    language?: MetadataLanguage,
    narrator?: string,
    pageSize?: MetadataSearchCount,
    title?: string,
    headers: HeadersInit = {},
    interceptors?: ApiInterceptor[]
  ): Promise<ApiResponse<MetadataSearchBook[]>> {
    const __finalUrl = __createUrl(`/api/metadata/search`, {
      author,
      keywords,
      language,
      narrator,
      pageSize,
      region,
      title,
    })
    return __request(__finalUrl, "GET", "json", headers, undefined, interceptors)
  },
  getAuthorMetadata(
    id: string,
    provider: string,
    region: string,
    headers: HeadersInit = {},
    interceptors?: ApiInterceptor[]
  ): Promise<ApiResponse<MetadataAuthor>> {
    const __finalUrl = __createUrl(`/api/metadata/author/${id}`, { provider, region })
    return __request(__finalUrl, "GET", "json", headers, undefined, interceptors)
  },
  searchAuthorMetadata(
    q: string,
    region: string,
    headers: HeadersInit = {},
    interceptors?: ApiInterceptor[]
  ): Promise<ApiResponse<MetadataAuthor[]>> {
    const __finalUrl = __createUrl(`/api/metadata/author/search`, { q, region })
    return __request(__finalUrl, "GET", "json", headers, undefined, interceptors)
  },
  getBookMetadata(
    id: string,
    provider: string,
    region: string,
    headers: HeadersInit = {},
    interceptors?: ApiInterceptor[]
  ): Promise<ApiResponse<MetadataBook>> {
    const __finalUrl = __createUrl(`/api/metadata/book/${id}`, { provider, region })
    return __request(__finalUrl, "GET", "json", headers, undefined, interceptors)
  },
  searchBookMetadata(
    q: string,
    region: string,
    authorName?: string,
    headers: HeadersInit = {},
    interceptors?: ApiInterceptor[]
  ): Promise<ApiResponse<MetadataBook[]>> {
    const __finalUrl = __createUrl(`/api/metadata/book/search`, { authorName, q, region })
    return __request(__finalUrl, "GET", "json", headers, undefined, interceptors)
  },
  getSeriesMetadata(
    id: string,
    provider: string,
    region: string,
    headers: HeadersInit = {},
    interceptors?: ApiInterceptor[]
  ): Promise<ApiResponse<MetadataSeries>> {
    const __finalUrl = __createUrl(`/api/metadata/series/${id}`, { provider, region })
    return __request(__finalUrl, "GET", "json", headers, undefined, interceptors)
  },
  searchSeriesMetadata(
    q: string,
    region: string,
    authorName?: string,
    headers: HeadersInit = {},
    interceptors?: ApiInterceptor[]
  ): Promise<ApiResponse<MetadataSeries[]>> {
    const __finalUrl = __createUrl(`/api/metadata/series/search`, { authorName, q, region })
    return __request(__finalUrl, "GET", "json", headers, undefined, interceptors)
  },
  getAudioFile(id: UUID, headers: HeadersInit = {}, interceptors?: ApiInterceptor[]): Promise<ApiResponse<Blob>> {
    const __finalUrl = `/api/stream/audio/${id}`
    return __request(__finalUrl, "GET", "blob", headers, undefined, interceptors)
  },
  getImageFile(id: UUID, headers: HeadersInit = {}, interceptors?: ApiInterceptor[]): Promise<ApiResponse<Blob>> {
    const __finalUrl = `/api/stream/images/${id}`
    return __request(__finalUrl, "GET", "blob", headers, undefined, interceptors)
  },
  pingServer(headers: HeadersInit = {}, interceptors?: ApiInterceptor[]): Promise<ApiResponse<Unit>> {
    const __finalUrl = `/api/ping`
    return __request(__finalUrl, "GET", "json", headers, undefined, interceptors)
  },
} as const
