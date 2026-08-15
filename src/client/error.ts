import { apiErrorMessage } from "@thoth/utils/utils"
import { ApiError, ApiResponse } from "./generated/client"

export class ThothApiError extends Error {
  readonly status: number | undefined
  readonly error: ApiError["error"]

  constructor(response: ApiError) {
    super(apiErrorMessage(response.error))
    this.name = "ThothApiError"
    this.status = response.status
    this.error = response.error
  }
}

export const unwrap = async <T>(response: Promise<ApiResponse<T>>): Promise<T> => {
  const result = await response
  if (!result.success) throw new ThothApiError(result)
  return result.body
}

export const isAuthError = (error: unknown): boolean => error instanceof ThothApiError && error.status === 401
