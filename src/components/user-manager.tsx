import { useMemo, useState } from "react"
import { toast } from "sonner"
import { DataTable } from "@thoth/components/data-table/data-table"
import { DataTableToolbar } from "@thoth/components/data-table/data-table-toolbar"
import { UserRow, userColumns } from "@thoth/components/user-columns"
import { UserDialog, UserFormValues } from "@thoth/components/user-dialog"
import { useForm } from "@thoth/hooks/form.tsx"
import { useDeleteUser, useUpdateUser, useUsers } from "@thoth/queries/users"
import { useAuthState } from "@thoth/state/auth.state"

export const UserManager = () => {
  const loggedInUserId = useAuthState(s => s.accessToken?.payload.sub)
  const [isOpen, setIsOpen] = useState(false)
  const { data: users } = useUsers()
  const updateUserMutation = useUpdateUser()
  const deleteUserMutation = useDeleteUser()

  const updateUser = (user: UserFormValues) => {
    updateUserMutation.mutate(
      {
        id: user.id!,
        username: user.username,
        permissions: {
          isAdmin: user.admin,
          libraries: user.libraries.map(l => ({ id: l, permissions: "READONLY" })),
        },
      },
      {
        onSuccess: () => {
          setIsOpen(false)
          toast.success("User updated")
        },
      }
    )
  }

  const form = useForm<UserFormValues>({
    username: "",
    admin: false,
    libraries: [],
    id: undefined,
  })

  const openEdit = (user: UserRow) => {
    form.setAllFields({
      id: user.id,
      username: user.username,
      admin: user.permissions.isAdmin,
      libraries: user.permissions.libraries.map(l => l.id),
    })
    setIsOpen(true)
  }

  const deleteUser = (user: UserRow) => deleteUserMutation.mutate(user.id)

  const columns = useMemo(
    () => userColumns({ currentUserId: loggedInUserId, onEdit: openEdit, onDelete: deleteUser }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loggedInUserId]
  )

  return (
    <>
      <div className="mt-4 flex min-h-0 flex-1 flex-col">
        <DataTable
          columns={columns}
          data={users ?? []}
          onRowClick={openEdit}
          emptyState="No users yet"
          toolbar={table => (
            <DataTableToolbar table={table} searchColumnId="username" searchPlaceholder="Filter users..." />
          )}
        />
      </div>
      <UserDialog isOpen={isOpen} form={form} setIsOpen={setIsOpen} onSubmit={updateUser} />
    </>
  )
}
