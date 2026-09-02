import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { queries } from "./queries"

export const useLibrarySearch = (debounceMs = 100) => {
  const [query, setQuery] = useState("")
  const [debounced, setDebounced] = useState("")

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(query), debounceMs)
    return () => clearTimeout(timeout)
  }, [query, debounceMs])

  const { data } = useQuery({
    ...queries.librarySearch(debounced),
    enabled: debounced.trim() !== "",
    placeholderData: keepPreviousData,
  })

  return { query, setQuery, result: data ?? null }
}
