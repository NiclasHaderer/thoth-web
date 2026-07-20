import { useState } from "react"
import { MdDelete, MdEdit, MdPerson } from "react-icons/md"
import { Api } from "@thoth/client"
import { UserDialog, UserFormValues } from "@thoth/components/user-dialog"
import { useHttpRequest } from "@thoth/hooks/async-response"
import { useForm } from "@thoth/hooks/form.tsx"
import { useOnMount } from "@thoth/hooks/lifecycle"
import { useAuthState } from "@thoth/state/auth.state"

export const UserManager = () => {
  const loggedInUserId = useAuthState(s => s.accessToken?.payload.sub)
  const [isOpen, setIsOpen] = useState(false)
  const { result: users, invoke: listUsers } = useHttpRequest(Api.listUsers)
  useOnMount(() => listUsers())

  const updateUser = (user: UserFormValues) => {
    console.log(user.libraries)
    Api.updateUsername({ id: user.id! }, { username: user.username })
    Api.updatePermissions(
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
  }

  const form = useForm<UserFormValues>({
    username: "",
    admin: false,
    libraries: [],
    id: undefined,
  })

  return (
    <>
      <p>
        As an admin of our website, you now have the ability to create new user accounts and grant them access to our
        extensive library of audiobooks. With just a few clicks, you can easily manage user accounts and ensure that
        each user has the appropriate level of access to our audiobook server.
      </p>
      <div className="mt-4 w-full overflow-y-auto">
        <table className="w-full table-auto overflow-hidden rounded">
          <thead>
            <tr className="bg-elevate p-2 *:py-2">
              <th className="pl-2 text-left">
                <div className="flex items-center">
                  <MdPerson className="mr-4 h-6 w-6" />
                  Username
                </div>
              </th>
              <th className="pl-2 text-left">Role</th>
              <th className="pl-2 text-left">Libraries</th>
              <th className="w-0"></th>
              <th className="w-0"></th>
            </tr>
          </thead>
          <tbody>
            {
              <>
                {users?.map(user => (
                  <tr
                    className="group cursor-pointer whitespace-nowrap odd:bg-active-light hover:bg-active *:py-2"
                    key={user.id}
                    onClick={() => {
                      form.setAllFields({
                        id: user.id,
                        username: user.username,
                        admin: user.permissions.isAdmin,
                        libraries: user.permissions.libraries.map(l => l.id),
                      })
                      setIsOpen(true)
                    }}
                  >
                    <td className="pl-2">{user.username}</td>
                    <td className="pl-2">{user.permissions.isAdmin ? "Admin" : "User"}</td>
                    <td className="pl-2">
                      {user.permissions.libraries.map(l => `${l.name} (${l.permissions})`).join(", ")}
                    </td>
                    <td className="pr-2">
                      <MdEdit className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                    </td>
                    <td className="pr-2">
                      {loggedInUserId !== user.id && (
                        <MdDelete
                          onClick={async e => {
                            e.stopPropagation()
                            await Api.deleteUser({ id: user.id })
                            await listUsers()
                          }}
                          className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100"
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </>
            }
          </tbody>
        </table>
      </div>
      <UserDialog isOpen={isOpen} form={form} setIsOpen={setIsOpen} onSubmit={updateUser} />
    </>
  )
}
