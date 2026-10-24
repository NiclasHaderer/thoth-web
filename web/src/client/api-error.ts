import { apiErrorMessage } from "@dewey/utils/utils"
import { ApiError } from "./generated/client"

export class DeweyApiError extends Error {
  readonly status: number | undefined
  readonly error: ApiError["error"]

  constructor(response: ApiError) {
    super(apiErrorMessage(response.error))
    this.name = "DeweyApiError"
    this.status = response.status
    this.error = response.error
  }
}

export const isAuthError = (error: unknown): boolean => error instanceof DeweyApiError && error.status === 401

export const isNotFoundError = (error: unknown): boolean => error instanceof DeweyApiError && error.status === 404

export const isNetworkError = (error: unknown): boolean => error instanceof DeweyApiError && error.status === undefined
