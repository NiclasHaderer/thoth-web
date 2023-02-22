import { useState } from "react"
import { WrappedResponse } from "../client"

type AsyncResponse<T> =
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

type HttpInvocation<ARGS extends any[]> = {
  invoke: (...args: ARGS) => void
}

export const useHttpRequest = <T, ARGS extends any[]>(
  apiCall: (...args: ARGS) => Promise<WrappedResponse<T>>
): HttpInvocation<ARGS> & AsyncResponse<T> => {
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
          setResult(result.success ? result.data : null)
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
  } as HttpInvocation<ARGS> & AsyncResponse<T>
}
