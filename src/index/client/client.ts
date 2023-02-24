import { notNull } from "../utils"

export type HTTP_METHOD = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"

export type QueryParameter = string | number | null
export type RequestBody = object | string

export interface QueryParameters {
  [name: string]: QueryParameter | QueryParameter[]
}

export type WrappedResponse<T> =
  | {
      data: T
      success: true
    }
  | { data: object; success: false }

export type TClient = {
  request<T>(
    method: HTTP_METHOD,
    url: string,
    params?: QueryParameters,
    body?: RequestBody
  ): Promise<WrappedResponse<T>>
  get<T>(url: string, params?: QueryParameters): Promise<WrappedResponse<T>>
  post<T, B extends RequestBody>(url: string, body: B, params?: QueryParameters): Promise<WrappedResponse<T>>
  patch<T, B extends RequestBody>(url: string, body: Partial<B>, params?: QueryParameters): Promise<WrappedResponse<T>>
  put<T, B extends RequestBody>(url: string, body: B, params?: QueryParameters): Promise<WrappedResponse<T>>
  delete<T, B extends RequestBody>(url: string, params?: QueryParameters, body?: B): Promise<WrappedResponse<T>>
}

const appendSearchParams = (urlParams: URL, query: QueryParameters) => {
  const params = urlParams.searchParams
  for (const [key, value] of Object.entries(query)) {
    if (Array.isArray(value)) {
      value.filter(notNull).forEach(v => params.append(key, v.toString()))
    } else {
      if (notNull(value)) {
        params.append(key, value.toString())
      }
    }
  }
}

export const withSearchParams = (url: string, query: QueryParameters | undefined) => {
  const urlObject = new URL(url)
  query && appendSearchParams(urlObject, query)
  return urlObject.toString()
}

export const getClient = (): TClient => {
  const executeRequest = (method: HTTP_METHOD, url: string, body: RequestBody | undefined) => {
    const isJson = typeof body === "object"
    return fetch(url, {
      method,
      body: isJson ? JSON.stringify(body) : body,
      headers: {
        ...(isJson ? { "Content-Type": "application/json" } : {}),
      },
    })
  }

  return {
    request<T>(
      method: HTTP_METHOD,
      url: string,
      params?: QueryParameters,
      body?: RequestBody
    ): Promise<WrappedResponse<T>> {
      url = withSearchParams(url, params)

      return executeRequest(method, url.toString(), body).then(async res => {
        return { data: await res.json(), success: res.status < 400 }
      })
    },
    get<T>(url: string, params?: QueryParameters): Promise<WrappedResponse<T>> {
      return this.request<T>("GET", url, params)
    },
    post<T, B extends RequestBody>(url: string, body: B, params?: QueryParameters): Promise<WrappedResponse<T>> {
      return this.request("POST", url, params, body)
    },
    put<T, B extends RequestBody>(url: string, body: B, params?: QueryParameters): Promise<WrappedResponse<T>> {
      return this.request("PUT", url, params, body)
    },
    patch<T, B extends RequestBody>(
      url: string,
      body?: Partial<B>,
      params?: QueryParameters
    ): Promise<WrappedResponse<T>> {
      return this.request("PATCH", url, params, body)
    },
    delete<T, B extends RequestBody>(
      url: string,
      params?: QueryParameters,
      body?: Partial<B>
    ): Promise<WrappedResponse<T>> {
      return this.request("DELETE", url, params, body)
    },
  }
}
