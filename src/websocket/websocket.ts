import { Param } from "@thoth/models/utility-types"

export interface Unsubscribe {
  unsubscribe: () => void
}

enum WebsocketState {
  CLOSED,
  CLOSING,
  CONNECTING,
  OPEN,
}

export interface WebsocketConnection<T> {
  readonly state: WebsocketState

  onMessage(callback: (e: T) => void): Unsubscribe

  onRawMessage(callback: (e: MessageEvent) => void): Unsubscribe

  close(code?: number, reason?: string): void

  onOpen(callback: (e?: Event) => void): Unsubscribe

  onClose(callback: (e?: CloseEvent) => void): Unsubscribe

  onError(callback: (e?: Event) => void): Unsubscribe
}

const addWithUnsubscribe = <T>(list: T[], arg: T): Unsubscribe => {
  list.push(arg)
  return {
    unsubscribe: () => {
      const index = list.findIndex(item => item === arg)
      list.splice(index, 1)
    },
  }
}

const stateFromWebsocket = (socket: WebSocket): WebsocketState => {
  switch (socket.readyState) {
    case socket.CLOSING:
      return WebsocketState.CLOSING
    case socket.CLOSED:
      return WebsocketState.CLOSED
    case socket.CONNECTING:
      return WebsocketState.CONNECTING
    default:
      return WebsocketState.OPEN
  }
}

export const getWebsocket = <T>(url: string): WebsocketConnection<T> => {
  const messageCallbacks: Param<WebsocketConnection<T>, "onMessage">[] = []
  const rawMessageCallbacks: Param<WebsocketConnection<T>, "onRawMessage">[] = []
  const openCallbacks: Param<WebsocketConnection<T>, "onOpen">[] = []
  const closeCallbacks: Param<WebsocketConnection<T>, "onClose">[] = []
  const errorCallbacks: Param<WebsocketConnection<T>, "onError">[] = []
  const socket = new WebSocket(url)

  const websocketConnection: WebsocketConnection<T> = {
    get state() {
      return stateFromWebsocket(socket)
    },
    onMessage: callback => addWithUnsubscribe(messageCallbacks, callback),
    onRawMessage: callback => addWithUnsubscribe(rawMessageCallbacks, callback),
    close: (code?: number, reason?: string) => socket.close(code, reason),
    onOpen: callback => addWithUnsubscribe(openCallbacks, callback),
    onClose: callback => addWithUnsubscribe(closeCallbacks, callback),
    onError: callback => addWithUnsubscribe(errorCallbacks, callback),
  }

  socket.addEventListener("message", (e: MessageEvent<string>) => {
    rawMessageCallbacks.forEach(c => c(e))
    const data = JSON.parse(e.data) as T
    messageCallbacks.forEach(c => c(data))
  })
  socket.addEventListener("error", e => {
    errorCallbacks.forEach(c => c(e))
  })
  socket.addEventListener("open", e => {
    openCallbacks.forEach(c => c(e))
  })
  socket.addEventListener("close", e => {
    closeCallbacks.forEach(c => c(e))
  })

  return websocketConnection
}
