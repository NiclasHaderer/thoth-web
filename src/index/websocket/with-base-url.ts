import { environment } from "../env"
import { getWebsocket, WebsocketConnection } from "./websocket"
import { toRealURL } from "../client/with-base-url"

export const websocketWithBaseUrl = <T>(baseURL: string, url: string): WebsocketConnection<T> => {
  baseURL = toRealURL(baseURL)
  baseURL = baseURL.replace(/https?:\/\//, "")
  if (environment.isHttps) {
    baseURL = `wss://${baseURL}`
  } else {
    baseURL = `ws://${baseURL}`
  }
  const completeURL = new URL(url, baseURL).toString()
  return getWebsocket<T>(completeURL)
}