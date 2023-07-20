import type {
  AccessToken,
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
  Empty,
  FileScanner,
  FileSystemItem,
  JWKs,
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
  UserModel,
  UsernameChange,
  UUID,
} from "./models"

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
const __request = async <T>(
  route: string,
  method: string,
  bodyParseMethod: "text" | "json" | "blob",
  headers: Headers,
  body: object | undefined,
  interceptors: ApiInterceptor[],
  executor: ApiCallData["executor"],
  requiresAuth: boolean
): Promise<ApiResponse<T>> => {
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }
  let apiCallData: ApiCallData = {
    route,
    method,
    body,
    headers,
    bodySerializer: (body?: object) => (body ? JSON.stringify(body) : undefined),
    executor,
    requiresAuth,
  }
  if (interceptors.length > 0) {
    for (const interceptor of interceptors) {
      apiCallData = await interceptor(apiCallData)
    }
  }

  return apiCallData
    .executor(apiCallData)
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
      body: LoginUser,
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<AccessToken>> {
      const headersImpl = new Headers(headers)
      defaultHeadersImpl.forEach((value, key) => headersImpl.append(key, value))
      return __request(
        `/api/auth/login`,
        "POST",
        "json",
        headersImpl,
        body,
        [...defaultInterceptors, ...interceptors],
        executor,
        false
      )
    },
    registerUser(
      body: RegisterUser,
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<UserModel>> {
      const headersImpl = new Headers(headers)
      defaultHeadersImpl.forEach((value, key) => headersImpl.append(key, value))
      return __request(
        `/api/auth/register`,
        "POST",
        "json",
        headersImpl,
        body,
        [...defaultInterceptors, ...interceptors],
        executor,
        false
      )
    },
    retrieveJwks(headers: HeadersInit = {}, interceptors: ApiInterceptor[] = []): Promise<ApiResponse<JWKs>> {
      const headersImpl = new Headers(headers)
      defaultHeadersImpl.forEach((value, key) => headersImpl.append(key, value))
      return __request(
        `/api/auth/.well-known/jwks.json`,
        "GET",
        "json",
        headersImpl,
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        false
      )
    },
    updateUser(
      {
        id,
      }: {
        id: UUID
      },
      body: ModifyUser,
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<UserModel>> {
      const headersImpl = new Headers(headers)
      defaultHeadersImpl.forEach((value, key) => headersImpl.append(key, value))
      return __request(
        __createUrl(`/api/auth/user/edit`, { id }),
        "PUT",
        "json",
        headersImpl,
        body,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    getCurrentUser(headers: HeadersInit = {}, interceptors: ApiInterceptor[] = []): Promise<ApiResponse<UserModel>> {
      const headersImpl = new Headers(headers)
      defaultHeadersImpl.forEach((value, key) => headersImpl.append(key, value))
      return __request(
        `/api/auth/user`,
        "GET",
        "json",
        headersImpl,
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    deleteUser(headers: HeadersInit = {}, interceptors: ApiInterceptor[] = []): Promise<ApiResponse<Empty>> {
      const headersImpl = new Headers(headers)
      defaultHeadersImpl.forEach((value, key) => headersImpl.append(key, value))
      return __request(
        `/api/auth/user`,
        "DELETE",
        "text",
        headersImpl,
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    listUsers(headers: HeadersInit = {}, interceptors: ApiInterceptor[] = []): Promise<ApiResponse<UserModel[]>> {
      const headersImpl = new Headers(headers)
      defaultHeadersImpl.forEach((value, key) => headersImpl.append(key, value))
      return __request(
        `/api/auth/user/all`,
        "GET",
        "json",
        headersImpl,
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    updateUsername(
      body: UsernameChange,
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<UserModel>> {
      const headersImpl = new Headers(headers)
      defaultHeadersImpl.forEach((value, key) => headersImpl.append(key, value))
      return __request(
        `/api/auth/user/username`,
        "POST",
        "json",
        headersImpl,
        body,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    updatePassword(
      body: PasswordChange,
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Empty>> {
      const headersImpl = new Headers(headers)
      defaultHeadersImpl.forEach((value, key) => headersImpl.append(key, value))
      return __request(
        `/api/auth/user/password`,
        "POST",
        "text",
        headersImpl,
        body,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    refreshAccessToken(
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<AccessToken>> {
      const headersImpl = new Headers(headers)
      defaultHeadersImpl.forEach((value, key) => headersImpl.append(key, value))
      return __request(
        `/api/auth/user/refresh`,
        "POST",
        "json",
        headersImpl,
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        false
      )
    },
    listFoldersAtACertainPath(
      {
        path,
        showHidden,
      }: {
        path: string
        showHidden?: boolean
      },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<FileSystemItem[]>> {
      const headersImpl = new Headers(headers)
      defaultHeadersImpl.forEach((value, key) => headersImpl.append(key, value))
      return __request(
        __createUrl(`/api/fs`, {
          path,
          showHidden,
        }),
        "GET",
        "json",
        headersImpl,
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    listLibraries(
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<LibraryModel[]>> {
      const headersImpl = new Headers(headers)
      defaultHeadersImpl.forEach((value, key) => headersImpl.append(key, value))
      return __request(
        `/api/libraries`,
        "GET",
        "json",
        headersImpl,
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
      const headersImpl = new Headers(headers)
      defaultHeadersImpl.forEach((value, key) => headersImpl.append(key, value))
      return __request(
        `/api/libraries`,
        "POST",
        "json",
        headersImpl,
        body,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    getLibrary(
      {
        libraryId,
      }: {
        libraryId: UUID
      },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<LibraryModel>> {
      const headersImpl = new Headers(headers)
      defaultHeadersImpl.forEach((value, key) => headersImpl.append(key, value))
      return __request(
        `/api/libraries/${libraryId}`,
        "GET",
        "json",
        headersImpl,
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    replaceLibrary(
      {
        libraryId,
      }: {
        libraryId: UUID
      },
      body: LibraryApiModel,
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<LibraryModel>> {
      const headersImpl = new Headers(headers)
      defaultHeadersImpl.forEach((value, key) => headersImpl.append(key, value))
      return __request(
        `/api/libraries/${libraryId}`,
        "PUT",
        "json",
        headersImpl,
        body,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    updateLibrary(
      {
        libraryId,
      }: {
        libraryId: UUID
      },
      body: PartialLibraryApiModel,
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<LibraryModel>> {
      const headersImpl = new Headers(headers)
      defaultHeadersImpl.forEach((value, key) => headersImpl.append(key, value))
      return __request(
        `/api/libraries/${libraryId}`,
        "PATCH",
        "json",
        headersImpl,
        body,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    rescanLibrary(
      {
        libraryId,
      }: {
        libraryId: UUID
      },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Empty>> {
      const headersImpl = new Headers(headers)
      defaultHeadersImpl.forEach((value, key) => headersImpl.append(key, value))
      return __request(
        `/api/libraries/${libraryId}/rescan`,
        "POST",
        "text",
        headersImpl,
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    rescanAllLibraries(headers: HeadersInit = {}, interceptors: ApiInterceptor[] = []): Promise<ApiResponse<Empty>> {
      const headersImpl = new Headers(headers)
      defaultHeadersImpl.forEach((value, key) => headersImpl.append(key, value))
      return __request(
        `/api/libraries/rescan`,
        "POST",
        "text",
        headersImpl,
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    searchInAllLibraries(
      {
        author,
        book,
        q,
        series,
      }: {
        author?: string
        book?: string
        q?: string
        series?: string
      },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<SearchModel>> {
      const headersImpl = new Headers(headers)
      defaultHeadersImpl.forEach((value, key) => headersImpl.append(key, value))
      return __request(
        __createUrl(`/api/libraries/search`, {
          author,
          book,
          q,
          series,
        }),
        "GET",
        "json",
        headersImpl,
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    listFileScanners(
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<FileScanner[]>> {
      const headersImpl = new Headers(headers)
      defaultHeadersImpl.forEach((value, key) => headersImpl.append(key, value))
      return __request(
        `/api/scanners`,
        "GET",
        "json",
        headersImpl,
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    listMetadataAgents(
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<MetadataAgentApiModel[]>> {
      const headersImpl = new Headers(headers)
      defaultHeadersImpl.forEach((value, key) => headersImpl.append(key, value))
      return __request(
        `/api/metadata-agents`,
        "GET",
        "json",
        headersImpl,
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    listBooks(
      {
        limit,
        offset,
        libraryId,
      }: {
        limit?: number
        offset?: number
        libraryId: UUID
      },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<PaginatedResponse<BookModel>>> {
      const headersImpl = new Headers(headers)
      defaultHeadersImpl.forEach((value, key) => headersImpl.append(key, value))
      return __request(
        __createUrl(`/api/libraries/${libraryId}/books`, {
          limit,
          offset,
        }),
        "GET",
        "json",
        headersImpl,
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    listBookSorting(
      {
        limit,
        offset,
        libraryId,
      }: {
        limit?: number
        offset?: number
        libraryId: UUID
      },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<UUID[]>> {
      const headersImpl = new Headers(headers)
      defaultHeadersImpl.forEach((value, key) => headersImpl.append(key, value))
      return __request(
        __createUrl(`/api/libraries/${libraryId}/books/sorting`, {
          limit,
          offset,
        }),
        "GET",
        "json",
        headersImpl,
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    getBookPosition(
      {
        id,
        libraryId,
      }: {
        id: UUID
        libraryId: UUID
      },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Position>> {
      const headersImpl = new Headers(headers)
      defaultHeadersImpl.forEach((value, key) => headersImpl.append(key, value))
      return __request(
        `/api/libraries/${libraryId}/books/${id}/position`,
        "GET",
        "json",
        headersImpl,
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    getBook(
      {
        id,
        libraryId,
      }: {
        id: UUID
        libraryId: UUID
      },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<DetailedBookModel>> {
      const headersImpl = new Headers(headers)
      defaultHeadersImpl.forEach((value, key) => headersImpl.append(key, value))
      return __request(
        `/api/libraries/${libraryId}/books/${id}`,
        "GET",
        "json",
        headersImpl,
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    updateBook(
      {
        id,
        libraryId,
      }: {
        id: UUID
        libraryId: UUID
      },
      body: PartialBookApiModel,
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<BookModel>> {
      const headersImpl = new Headers(headers)
      defaultHeadersImpl.forEach((value, key) => headersImpl.append(key, value))
      return __request(
        `/api/libraries/${libraryId}/books/${id}`,
        "PATCH",
        "json",
        headersImpl,
        body,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    replaceBook(
      {
        id,
        libraryId,
      }: {
        id: UUID
        libraryId: UUID
      },
      body: BookApiModel,
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<BookModel>> {
      const headersImpl = new Headers(headers)
      defaultHeadersImpl.forEach((value, key) => headersImpl.append(key, value))
      return __request(
        `/api/libraries/${libraryId}/books/${id}`,
        "PUT",
        "json",
        headersImpl,
        body,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    getBookAutocomplete(
      {
        q,
        libraryId,
      }: {
        q: string
        libraryId: UUID
      },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<TitledId[]>> {
      const headersImpl = new Headers(headers)
      defaultHeadersImpl.forEach((value, key) => headersImpl.append(key, value))
      return __request(
        __createUrl(`/api/libraries/${libraryId}/books/autocomplete`, { q }),
        "GET",
        "json",
        headersImpl,
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    autoMatchBook(
      {
        id,
        libraryId,
      }: {
        id: UUID
        libraryId: UUID
      },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<BookModel>> {
      const headersImpl = new Headers(headers)
      defaultHeadersImpl.forEach((value, key) => headersImpl.append(key, value))
      return __request(
        `/api/libraries/${libraryId}/books/${id}/automatch`,
        "POST",
        "json",
        headersImpl,
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    listSeries(
      {
        limit,
        offset,
        libraryId,
      }: {
        limit?: number
        offset?: number
        libraryId: UUID
      },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<PaginatedResponse<SeriesModel>>> {
      const headersImpl = new Headers(headers)
      defaultHeadersImpl.forEach((value, key) => headersImpl.append(key, value))
      return __request(
        __createUrl(`/api/libraries/${libraryId}/series`, {
          limit,
          offset,
        }),
        "GET",
        "json",
        headersImpl,
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    listSeriesSorting(
      {
        limit,
        offset,
        order,
        libraryId,
      }: {
        limit?: number
        offset?: number
        order?: Order
        libraryId: UUID
      },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<UUID[]>> {
      const headersImpl = new Headers(headers)
      defaultHeadersImpl.forEach((value, key) => headersImpl.append(key, value))
      return __request(
        __createUrl(`/api/libraries/${libraryId}/series/sorting`, {
          limit,
          offset,
          order,
        }),
        "GET",
        "json",
        headersImpl,
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    getSeriesPosition(
      {
        order,
        id,
        libraryId,
      }: {
        order?: Order
        id: UUID
        libraryId: UUID
      },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Position>> {
      const headersImpl = new Headers(headers)
      defaultHeadersImpl.forEach((value, key) => headersImpl.append(key, value))
      return __request(
        __createUrl(`/api/libraries/${libraryId}/series/${id}/position`, { order }),
        "GET",
        "json",
        headersImpl,
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    getSeries(
      {
        id,
        libraryId,
      }: {
        id: UUID
        libraryId: UUID
      },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<DetailedSeriesModel>> {
      const headersImpl = new Headers(headers)
      defaultHeadersImpl.forEach((value, key) => headersImpl.append(key, value))
      return __request(
        `/api/libraries/${libraryId}/series/${id}`,
        "GET",
        "json",
        headersImpl,
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    updateSeries(
      {
        id,
        libraryId,
      }: {
        id: UUID
        libraryId: UUID
      },
      body: PartialSeriesApiModel,
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<SeriesModel>> {
      const headersImpl = new Headers(headers)
      defaultHeadersImpl.forEach((value, key) => headersImpl.append(key, value))
      return __request(
        `/api/libraries/${libraryId}/series/${id}`,
        "PATCH",
        "json",
        headersImpl,
        body,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    replaceSeries(
      {
        id,
        libraryId,
      }: {
        id: UUID
        libraryId: UUID
      },
      body: SeriesApiModel,
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<SeriesModel>> {
      const headersImpl = new Headers(headers)
      defaultHeadersImpl.forEach((value, key) => headersImpl.append(key, value))
      return __request(
        `/api/libraries/${libraryId}/series/${id}`,
        "PUT",
        "json",
        headersImpl,
        body,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    getSeriesAutocomplete(
      {
        q,
        libraryId,
      }: {
        q: string
        libraryId: UUID
      },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<TitledId[]>> {
      const headersImpl = new Headers(headers)
      defaultHeadersImpl.forEach((value, key) => headersImpl.append(key, value))
      return __request(
        __createUrl(`/api/libraries/${libraryId}/series/autocomplete`, { q }),
        "GET",
        "json",
        headersImpl,
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    listAuthors(
      {
        limit,
        offset,
        order,
        libraryId,
      }: {
        limit?: number
        offset?: number
        order?: Order
        libraryId: UUID
      },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<PaginatedResponse<AuthorModel>>> {
      const headersImpl = new Headers(headers)
      defaultHeadersImpl.forEach((value, key) => headersImpl.append(key, value))
      return __request(
        __createUrl(`/api/libraries/${libraryId}/authors`, {
          limit,
          offset,
          order,
        }),
        "GET",
        "json",
        headersImpl,
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    listAuthorSorting(
      {
        limit,
        offset,
        order,
        libraryId,
      }: {
        limit?: number
        offset?: number
        order?: Order
        libraryId: UUID
      },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<UUID[]>> {
      const headersImpl = new Headers(headers)
      defaultHeadersImpl.forEach((value, key) => headersImpl.append(key, value))
      return __request(
        __createUrl(`/api/libraries/${libraryId}/authors/sorting`, {
          limit,
          offset,
          order,
        }),
        "GET",
        "json",
        headersImpl,
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    getAuthorPosition(
      {
        order,
        id,
        libraryId,
      }: {
        order?: Order
        id: UUID
        libraryId: UUID
      },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Position>> {
      const headersImpl = new Headers(headers)
      defaultHeadersImpl.forEach((value, key) => headersImpl.append(key, value))
      return __request(
        __createUrl(`/api/libraries/${libraryId}/authors/${id}/position`, { order }),
        "GET",
        "json",
        headersImpl,
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    getAuthor(
      {
        id,
        libraryId,
      }: {
        id: UUID
        libraryId: UUID
      },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<DetailedAuthorModel>> {
      const headersImpl = new Headers(headers)
      defaultHeadersImpl.forEach((value, key) => headersImpl.append(key, value))
      return __request(
        `/api/libraries/${libraryId}/authors/${id}`,
        "GET",
        "json",
        headersImpl,
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    updateAuthor(
      {
        id,
        libraryId,
      }: {
        id: UUID
        libraryId: UUID
      },
      body: PartialAuthorApiModel,
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<AuthorModel>> {
      const headersImpl = new Headers(headers)
      defaultHeadersImpl.forEach((value, key) => headersImpl.append(key, value))
      return __request(
        `/api/libraries/${libraryId}/authors/${id}`,
        "PATCH",
        "json",
        headersImpl,
        body,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    replaceAuthor(
      {
        id,
        libraryId,
      }: {
        id: UUID
        libraryId: UUID
      },
      body: AuthorApiModel,
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<AuthorModel>> {
      const headersImpl = new Headers(headers)
      defaultHeadersImpl.forEach((value, key) => headersImpl.append(key, value))
      return __request(
        `/api/libraries/${libraryId}/authors/${id}`,
        "PUT",
        "json",
        headersImpl,
        body,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    getAuthorAutocomplete(
      {
        q,
        libraryId,
      }: {
        q: string
        libraryId: UUID
      },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<NamedId[]>> {
      const headersImpl = new Headers(headers)
      defaultHeadersImpl.forEach((value, key) => headersImpl.append(key, value))
      return __request(
        __createUrl(`/api/libraries/${libraryId}/authors/autocomplete`, { q }),
        "GET",
        "json",
        headersImpl,
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
    ): Promise<ApiResponse<MetadataSearchBook[]>> {
      const headersImpl = new Headers(headers)
      defaultHeadersImpl.forEach((value, key) => headersImpl.append(key, value))
      return __request(
        __createUrl(`/api/metadata/search`, {
          author,
          keywords,
          language,
          narrator,
          pageSize,
          region,
          title,
        }),
        "GET",
        "json",
        headersImpl,
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    getAuthorMetadata(
      {
        provider,
        region,
        id,
      }: {
        provider: string
        region: string
        id: string
      },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<MetadataAuthor>> {
      const headersImpl = new Headers(headers)
      defaultHeadersImpl.forEach((value, key) => headersImpl.append(key, value))
      return __request(
        __createUrl(`/api/metadata/author/${id}`, {
          provider,
          region,
        }),
        "GET",
        "json",
        headersImpl,
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    searchAuthorMetadata(
      {
        q,
        region,
      }: {
        q: string
        region: string
      },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<MetadataAuthor[]>> {
      const headersImpl = new Headers(headers)
      defaultHeadersImpl.forEach((value, key) => headersImpl.append(key, value))
      return __request(
        __createUrl(`/api/metadata/author/search`, {
          q,
          region,
        }),
        "GET",
        "json",
        headersImpl,
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    getBookMetadata(
      {
        provider,
        region,
        id,
      }: {
        provider: string
        region: string
        id: string
      },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<MetadataBook>> {
      const headersImpl = new Headers(headers)
      defaultHeadersImpl.forEach((value, key) => headersImpl.append(key, value))
      return __request(
        __createUrl(`/api/metadata/book/${id}`, {
          provider,
          region,
        }),
        "GET",
        "json",
        headersImpl,
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    searchBookMetadata(
      {
        authorName,
        q,
        region,
      }: {
        authorName?: string
        q: string
        region: string
      },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<MetadataBook[]>> {
      const headersImpl = new Headers(headers)
      defaultHeadersImpl.forEach((value, key) => headersImpl.append(key, value))
      return __request(
        __createUrl(`/api/metadata/book/search`, {
          authorName,
          q,
          region,
        }),
        "GET",
        "json",
        headersImpl,
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    getSeriesMetadata(
      {
        provider,
        region,
        id,
      }: {
        provider: string
        region: string
        id: string
      },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<MetadataSeries>> {
      const headersImpl = new Headers(headers)
      defaultHeadersImpl.forEach((value, key) => headersImpl.append(key, value))
      return __request(
        __createUrl(`/api/metadata/series/${id}`, {
          provider,
          region,
        }),
        "GET",
        "json",
        headersImpl,
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    searchSeriesMetadata(
      {
        authorName,
        q,
        region,
      }: {
        authorName?: string
        q: string
        region: string
      },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<MetadataSeries[]>> {
      const headersImpl = new Headers(headers)
      defaultHeadersImpl.forEach((value, key) => headersImpl.append(key, value))
      return __request(
        __createUrl(`/api/metadata/series/search`, {
          authorName,
          q,
          region,
        }),
        "GET",
        "json",
        headersImpl,
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
    getAudioFile(
      {
        id,
      }: {
        id: UUID
      },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Blob>> {
      const headersImpl = new Headers(headers)
      defaultHeadersImpl.forEach((value, key) => headersImpl.append(key, value))
      return __request(
        `/api/stream/audio/${id}`,
        "GET",
        "blob",
        headersImpl,
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        false
      )
    },
    getImageFile(
      {
        id,
      }: {
        id: UUID
      },
      headers: HeadersInit = {},
      interceptors: ApiInterceptor[] = []
    ): Promise<ApiResponse<Blob>> {
      const headersImpl = new Headers(headers)
      defaultHeadersImpl.forEach((value, key) => headersImpl.append(key, value))
      return __request(
        `/api/stream/images/${id}`,
        "GET",
        "blob",
        headersImpl,
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        false
      )
    },
    pingServer(headers: HeadersInit = {}, interceptors: ApiInterceptor[] = []): Promise<ApiResponse<Empty>> {
      const headersImpl = new Headers(headers)
      defaultHeadersImpl.forEach((value, key) => headersImpl.append(key, value))
      return __request(
        `/api/ping`,
        "GET",
        "text",
        headersImpl,
        undefined,
        [...defaultInterceptors, ...interceptors],
        executor,
        true
      )
    },
  } as const
}
