import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { Api, unwrap } from "@thoth/client"
import { queryKeys } from "./keys"

export const useLibrarySearch = (debounceMs = 100) => {
  const [query, setQuery] = useState("")
  const [debounced, setDebounced] = useState("")

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(query), debounceMs)
    return () => clearTimeout(timeout)
  }, [query, debounceMs])

  const { data } = useQuery({
    queryKey: queryKeys.librarySearch(debounced),
    queryFn: () => unwrap(Api.searchInAllLibraries({ q: debounced })),
    enabled: debounced.trim() !== "",
    placeholderData: keepPreviousData,
  })

  return { query, setQuery, result: data ?? null }
}
