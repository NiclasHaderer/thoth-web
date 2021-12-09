export const getWebsocket = <T>(url: string, callback: (e: T) => void) => {
  const socket = new WebSocket(url);
  socket.addEventListener('message', (e) => {
    callback(JSON.parse(e.data));
  });
  socket.addEventListener('open', () => console.log(`opened connection to ${url}`));
};
