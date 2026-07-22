import { useMemo, useState } from "react"
import { toast } from "sonner"
import { Api } from "@thoth/client"
import { DataTable } from "@thoth/components/data-table/data-table"
import { DataTableToolbar } from "@thoth/components/data-table/data-table-toolbar"
import { UserRow, userColumns } from "@thoth/components/user-columns"
import { UserDialog, UserFormValues } from "@thoth/components/user-dialog"
import { useHttpRequest } from "@thoth/hooks/async-response"
import { useForm } from "@thoth/hooks/form.tsx"
import { useOnMount } from "@thoth/hooks/lifecycle"
import { useAuthState } from "@thoth/state/auth.state"
import { apiErrorMessage } from "@thoth/utils/utils"

export const UserManager = () => {
  const loggedInUserId = useAuthState(s => s.accessToken?.payload.sub)
  const [isOpen, setIsOpen] = useState(false)
  const { result: users, invoke: listUsers } = useHttpRequest(Api.listUsers)
  useOnMount(() => listUsers())

  const updateUser = async (user: UserFormValues) => {
    const rename = await Api.updateUsername({ id: user.id! }, { username: user.username })
    if (!rename.success) {
      toast.error(apiErrorMessage(rename.error))
      return
    }
    const permissions = await Api.updatePermissions(
      { id: user.id! },
      {
        permissions: {
          isAdmin: user.admin,
          libraries: user.libraries.map(l => ({
            id: l,
            permissions: "READONLY",
          })),
        },
      }
    )
    if (!permissions.success) {
      toast.error(apiErrorMessage(permissions.error))
      return
    }
    await listUsers()
    setIsOpen(false)
    toast.success("User updated")
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

  const deleteUser = async (user: UserRow) => {
    const res = await Api.deleteUser({ id: user.id })
    if (!res.success) {
      toast.error(apiErrorMessage(res.error))
      return
    }
    await listUsers()
  }

  const columns = useMemo(
    () => userColumns({ currentUserId: loggedInUserId, onEdit: openEdit, onDelete: deleteUser }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loggedInUserId]
  )

  return (
    <>
      <div className="mt-4">
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
