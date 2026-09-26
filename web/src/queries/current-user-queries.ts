import { useQuery, useQueryClient } from "@tanstack/react-query"
import { queries } from "./query-definitions"

export const useCurrentUser = () => useQuery(queries.currentUser)

export const useSetUsername = () => {
  const queryClient = useQueryClient()
  return (username: string) =>
    queryClient.setQueryData(queries.currentUser.queryKey, previous => previous && { ...previous, username })
}
