import { HTTP_METHOD, QueryParameters, TClient } from "./Client"

export const toRealURL = (baseUrl: string): string => {
  if (baseUrl.startsWith("/")) {
    return `${window.location.protocol}//${window.location.host}${baseUrl}`
  }
  return baseUrl
}

export const withBaseUrl = <C extends TClient>(client: C, baseURL: string): C => {
  return {
    ...client,
    request<T>(method: HTTP_METHOD, url: string, params?: QueryParameters, body?: any): Promise<T | undefined> {
      url = url.startsWith("/") ? url.substring(1) : url
      const replaceUrl = new URL(url, toRealURL(baseURL)).toString()
      return client.request<T>(method, replaceUrl, params, body)
    },
  }
}
