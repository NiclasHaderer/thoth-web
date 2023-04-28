import { useState } from "react"
import { ApiResponse } from "@thoth/models/api-models"

type AsyncResponse<T, ARGS extends any[]> = (
  | {
      loading: true | null
      result: null
      error: false | null
    }
  | {
      loading: false
      result: T
      error: false
    }
  | {
      loading: false
      result: null
      error: true
    }
) & {
  invoke: (...args: ARGS) => void
}

export const useHttpRequest = <T, ARGS extends any[]>(
  apiCall: (...args: ARGS) => Promise<ApiResponse<T>>
): AsyncResponse<T, ARGS> => {
  const [loading, setLoading] = useState<boolean | null>(null)
  const [result, setResult] = useState<T | null>(null)
  const [error, setError] = useState<boolean | null>(null)

  return {
    invoke: (...args: ARGS): void => {
      setLoading(true)
      setResult(null)
      apiCall(...args)
        .then(result => {
          setLoading(false)
          setError(!result.success)
          setResult(result.success ? result.body : null)
        })
        .catch(() => {
          setLoading(false)
          setError(true)
          setResult(null)
        })
    },
    loading,
    result,
    error,
  } as AsyncResponse<T, ARGS>
}
