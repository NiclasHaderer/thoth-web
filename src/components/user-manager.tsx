import React, { useState } from "react"
import { MdDelete, MdEdit, MdPerson } from "react-icons/md"
import { UserDialog } from "@thoth/components/user-dialog"
import { useHttpRequest } from "@thoth/hooks/async-response"
import { Api, ThothUser, UserPermissionsModel, UUID } from "@thoth/client"
import { useOnMount } from "@thoth/hooks/lifecycle"
import { useAuthState } from "@thoth/state/auth.state"

export const UserManager = () => {
  const loggedInUserId = useAuthState(s => s.accessToken?.payload.sub)
  const [isOpen, setIsOpen] = useState(false)
  const { result: users, invoke: listUsers } = useHttpRequest(Api.listUsers)
  const updateUser = () => {
    throw new Error("Not implemented yet")
  }
  const [userToEdit, setUserToEdit] = useState<ThothUser<UUID, UserPermissionsModel>>()
  useOnMount(async () => {
    await listUsers()
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
            <tr className="bg-elevate p-2 [&>*]:py-2">
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
                    className="group cursor-pointer odd:bg-active-light hover:bg-active"
                    key={user.id}
                    onClick={() => {
                      setIsOpen(true)
                      setUserToEdit(user)
                    }}
                  >
                    <td className="pl-2">{user.username}</td>
                    <td className="pl-2">{user.permissions.isAdmin ? "Admin" : "User"}</td>
                    <td className="pl-2">
                      {user.permissions.libraries
                        .map(l => {
                          return `${l.name} (${l.canEdit ? "Edit" : "Read"})`
                        })
                        .join(", ")}
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
      {userToEdit && (
        <UserDialog
          isOpen={isOpen}
          user={userToEdit}
          setIsOpen={setIsOpen}
          onModifyUser={() => {
            updateUser()
          }}
        />
      )}
    </>
  )
}
