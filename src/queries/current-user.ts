import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Api, ThothUserWithPermissions, UserPermissions, unwrap } from "@thoth/client"
import { queryKeys } from "./keys"

export type CurrentUser = ThothUserWithPermissions<UserPermissions>

export const useCurrentUser = () =>
  useQuery({
    queryKey: queryKeys.currentUser,
    queryFn: () => unwrap(Api.getCurrentUser()),
    meta: { action: "load your profile" },
    staleTime: Infinity,
  })

export const useSetUsername = () => {
  const queryClient = useQueryClient()
  return (username: string) =>
    queryClient.setQueryData(queryKeys.currentUser, (previous: CurrentUser | undefined) =>
      previous ? { ...previous, username } : previous
    )
}
