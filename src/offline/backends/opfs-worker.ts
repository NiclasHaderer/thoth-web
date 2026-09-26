import type { WorkerReply, WorkerRequest } from "./worker-protocol"

const PROGRESS_STEP = 0.01

const reply = (message: WorkerReply) => postMessage(message)

const directory = async (segments: string[]) => {
  let dir = await navigator.storage.getDirectory()
  for (const segment of segments) dir = await dir.getDirectoryHandle(segment, { create: true })
  return dir
}

const stream = async (request: WorkerRequest, body: ReadableStream<Uint8Array>, total: number) => {
  const dir = await directory(request.dir)
  const file = await dir.getFileHandle(request.name, { create: true })
  const handle = await file.createSyncAccessHandle()
  const reader = body.getReader()
  let offset = 0
  let reported = 0

  try {
    handle.truncate(0)
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      offset += handle.write(value, { at: offset })
      const fraction = total > 0 ? Math.min(1, offset / total) : 0
      if (fraction - reported >= PROGRESS_STEP) {
        reported = fraction
        reply({ id: request.id, type: "progress", fraction })
      }
    }
    handle.flush()
    handle.close()
  } catch (error) {
    handle.close()
    await dir.removeEntry(request.name).catch(() => undefined)
    throw error
  }
}

const run = async (request: WorkerRequest) => {
  const response = await fetch(request.url, { headers: { Authorization: request.authorization } })
  if (response.status === 401) return reply({ id: request.id, type: "unauthorized" })
  if (!response.ok) throw new Error(`The server answered with ${response.status}`)
  if (!response.body) throw new Error("The server sent no data")

  await stream(request, response.body, Number(response.headers.get("content-length")))
  reply({ id: request.id, type: "done" })
}

addEventListener("message", (event: MessageEvent<WorkerRequest>) => {
  const request = event.data
  run(request).catch((error: unknown) => reply({ id: request.id, type: "error", error: String(error) }))
})
