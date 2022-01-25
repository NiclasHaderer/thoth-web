export type HTTP_METHOD = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"

export type QueryParameter = string | number
export type RequestBody = object | string

export interface QueryParameters {
  [name: string]: QueryParameter | QueryParameter[]
}

export type TClient = {
  request<T>(method: HTTP_METHOD, url: string, params?: QueryParameters, body?: RequestBody): Promise<T | undefined>
  get<T>(url: string, params?: QueryParameters): Promise<T | undefined>
  post<T, B extends RequestBody>(url: string, body: B, params?: QueryParameters): Promise<T | undefined>
  patch<T, B extends RequestBody>(url: string, body: Partial<B>, params?: QueryParameters): Promise<T | undefined>
  put<T, B extends RequestBody>(url: string, body: B, params?: QueryParameters): Promise<T | undefined>
  delete<T, B extends RequestBody>(url: string, params?: QueryParameters, body?: B): Promise<T | undefined>
}

const appendSearchParams = (urlParams: URL, query: QueryParameters) => {
  const params = urlParams.searchParams
  for (const [key, value] of Object.entries(query)) {
    if (Array.isArray(value)) {
      value.forEach(v => params.append(key, v.toString()))
    } else {
      params.append(key, value.toString())
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
    request<T>(method: HTTP_METHOD, url: string, params?: QueryParameters, body?: RequestBody): Promise<T | undefined> {
      url = withSearchParams(url, params)

      return new Promise<T>((resolve, reject) => {
        executeRequest(method, url.toString(), body)
          .then(async res => {
            if (res.status >= 400) {
              reject(res)
            } else {
              resolve(res.json())
            }
          })
          .catch(reject)
      })
    },
    get<T>(url: string, params?: QueryParameters): Promise<T | undefined> {
      return this.request("GET", url, params)
    },
    post<T, B extends RequestBody>(url: string, body: B, params?: QueryParameters): Promise<T | undefined> {
      return this.request("POST", url, params, body)
    },
    put<T, B extends RequestBody>(url: string, body: B, params?: QueryParameters): Promise<T | undefined> {
      return this.request("PUT", url, params, body)
    },
    patch<T, B extends RequestBody>(url: string, body?: Partial<B>, params?: QueryParameters): Promise<T | undefined> {
      return this.request("PATCH", url, params, body)
    },
    delete<T, B extends RequestBody>(url: string, params?: QueryParameters, body?: Partial<B>): Promise<T | undefined> {
      return this.request("DELETE", url, params, body)
    },
  }
}
