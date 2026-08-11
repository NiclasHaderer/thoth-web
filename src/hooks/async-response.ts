import { useMemo, useRef, useState } from "react"
import { ApiResponse } from "@thoth/client"

type AsyncResponse<T, ARGS extends unknown[]> = (
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
  invoke: (...args: ARGS) => Promise<ApiResponse<T>>
}

export const useHttpRequest = <T, ARGS extends unknown[]>(
  apiCall: (...args: ARGS) => Promise<ApiResponse<T>>
): AsyncResponse<T, ARGS> => {
  const [loading, setLoading] = useState<boolean | null>(null)
  const [result, setResult] = useState<T | null>(null)
  const [error, setError] = useState<boolean | null>(null)
  const latestCall = useRef(0)

  const invoke = useMemo(() => {
    return (async (...args: ARGS) => {
      latestCall.current += 1
      const call = latestCall.current
      setLoading(true)
      setResult(null)
      const result = await apiCall(...args)
      if (call !== latestCall.current) return result
      setLoading(false)
      setError(!result.success)
      setResult(result.success ? result.body : null)
      return result
    }) satisfies AsyncResponse<T, ARGS>[`invoke`]
  }, [apiCall])

  return {
    invoke,
    loading,
    result,
    error,
  } as AsyncResponse<T, ARGS>
}
