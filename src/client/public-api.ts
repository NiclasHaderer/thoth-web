import { ThothApiError } from "./api-error"
import { createApi } from "./generated/api-client"
import { ApiResponse } from "./generated/client"

export type Throwing<A> = {
  [K in keyof A]: A[K] extends (...args: infer P) => Promise<ApiResponse<infer R>> ? (...args: P) => Promise<R> : A[K]
}

type RawCall = (...args: unknown[]) => Promise<ApiResponse<unknown>>

export const unwrap = async <T>(response: Promise<ApiResponse<T>>): Promise<T> => {
  const result = await response
  if (!result.success) throw new ThothApiError(result)
  return result.body
}

export const throwing = <A extends object>(api: A): Throwing<A> =>
  Object.fromEntries(
    Object.entries(api).map(([name, entry]) => [
      name,
      typeof entry === "function" ? (...args: unknown[]) => unwrap((entry as RawCall)(...args)) : entry,
    ])
  ) as Throwing<A>

export const PublicApi = throwing(createApi())
