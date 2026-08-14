import { useEffect, useRef, useState } from "react"
import { Api, LibrarySearchResult } from "@thoth/client"

export const useLibrarySearch = (debounceMs = 100) => {
  const [query, setQuery] = useState("")
  const [result, setResult] = useState<LibrarySearchResult | null>(null)
  const timeout = useRef<number>(undefined)

  useEffect(() => {
    if (query.trim() === "") return

    clearTimeout(timeout.current)
    timeout.current = setTimeout(async () => {
      const res = await Api.searchInAllLibraries({ q: query })
      res.success && setResult(res.body)
    }, debounceMs) as unknown as number

    return () => clearTimeout(timeout.current)
  }, [query, debounceMs])

  return { query, setQuery, result }
}
