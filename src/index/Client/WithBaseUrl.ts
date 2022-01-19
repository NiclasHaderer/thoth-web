import { HTTP_METHOD, TClient } from "./Client"

export const withBaseUrl = <C extends TClient>(client: C, baseURL: string): C => {
  return {
    ...client,
    request<T>(method: HTTP_METHOD, url: string, body: any = undefined): Promise<T | undefined> {
      const replaceUrl = new URL(url, baseURL).toString()
      return client.request<T>(method, replaceUrl, body)
    },
  }
}
