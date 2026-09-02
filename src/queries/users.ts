import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Api, UUID, UpdateUserPermissions } from "@thoth/client"
import { invalidateMembership } from "./cache"
import { queries } from "./queries"

export const useUsers = () => useQuery(queries.users)

export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    meta: { action: "save the user" },
    mutationFn: async ({
      id,
      username,
      permissions,
    }: {
      id: UUID
      username: string
      permissions: UpdateUserPermissions
    }) => {
      await Api.updateUsername({ id }, { username })
      return Api.updatePermissions({ id }, { permissions })
    },
    onSuccess: () => invalidateMembership(queryClient),
  })
}

export const useUpdateUsername = () => {
  const queryClient = useQueryClient()
  return useMutation({
    meta: { action: "change the username" },
    mutationFn: ({ id, username }: { id: UUID; username: string }) => Api.updateUsername({ id }, { username }),
    onSuccess: () => invalidateMembership(queryClient),
  })
}

export const useUpdatePassword = () =>
  useMutation({
    meta: { action: "change the password" },
    mutationFn: ({ id, currentPassword, newPassword }: { id: UUID; currentPassword: string; newPassword: string }) =>
      Api.updatePassword({ id }, { currentPassword, newPassword }),
  })

export const useDeleteUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    meta: { action: "delete the user" },
    mutationFn: (id: UUID) => Api.deleteUser({ id }),
    onSuccess: () => invalidateMembership(queryClient),
  })
}
