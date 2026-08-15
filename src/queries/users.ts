import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Api, UUID, UpdateUserPermissions, unwrap } from "@thoth/client"
import { queryKeys } from "./keys"

export const useUsers = () =>
  useQuery({
    queryKey: queryKeys.users,
    queryFn: () => unwrap(Api.listUsers()),
    meta: { action: "load users" },
  })

const useInvalidateUsers = () => {
  const queryClient = useQueryClient()
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.users }),
      queryClient.invalidateQueries({ queryKey: queryKeys.currentUser }),
      queryClient.invalidateQueries({ queryKey: queryKeys.libraries }),
    ])
}

export const useUpdateUser = () => {
  const invalidateUsers = useInvalidateUsers()
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
      await unwrap(Api.updateUsername({ id }, { username }))
      return unwrap(Api.updatePermissions({ id }, { permissions }))
    },
    onSuccess: invalidateUsers,
  })
}

export const useUpdateUsername = () => {
  const invalidateUsers = useInvalidateUsers()
  return useMutation({
    meta: { action: "change the username" },
    mutationFn: ({ id, username }: { id: UUID; username: string }) => unwrap(Api.updateUsername({ id }, { username })),
    onSuccess: invalidateUsers,
  })
}

export const useUpdatePassword = () =>
  useMutation({
    meta: { action: "change the password" },
    mutationFn: ({ id, currentPassword, newPassword }: { id: UUID; currentPassword: string; newPassword: string }) =>
      unwrap(Api.updatePassword({ id }, { currentPassword, newPassword })),
  })

export const useDeleteUser = () => {
  const invalidateUsers = useInvalidateUsers()
  return useMutation({
    meta: { action: "delete the user" },
    mutationFn: (id: UUID) => unwrap(Api.deleteUser({ id })),
    onSuccess: invalidateUsers,
  })
}
