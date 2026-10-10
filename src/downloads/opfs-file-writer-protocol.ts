export type WorkerRequest = { id: number; url: string; authorization: string; dir: string[]; name: string }

export type WorkerReply = { id: number } & (
  | { type: "progress"; fraction: number }
  | { type: "done" }
  | { type: "unauthorized" }
  | { type: "error"; error: string }
)
