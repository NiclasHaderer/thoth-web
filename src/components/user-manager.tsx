import React, { useState } from "react"
import { MdEdit, MdPerson } from "react-icons/md"
import { UserDialog } from "@thoth/components/user-dialog"
import { useHttpRequest } from "@thoth/hooks/async-response"
import { Api, UserModel } from "@thoth/client"
import { useOnMount } from "@thoth/hooks/lifecycle"

export const UserManager = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { result: users, invoke: listUsers } = useHttpRequest(Api.listUsers)
  const { invoke: updateUser } = useHttpRequest(Api.updateUser)
  const [userToEdit, setUserToEdit] = useState<UserModel>()
  useOnMount(() => {
    console.log("listUsers")
    listUsers()
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
                    <td className="pl-2">
                      {user.admin ? "Admin" : "User"}
                      {user.edit ? "(Editor)" : ""}
                    </td>
                    <td className="pl-2">{user.libraries.map(l => l.name).join(", ")}</td>
                    <td className="pr-2">
                      <MdEdit className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                    </td>
                  </tr>
                ))}
                {users?.length === 0 && (
                  <tr className="odd:bg-active-light">
                    <td className="pl-2">No users yet</td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                )}
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
          onModifyUser={(id, values) => {
            updateUser({ id }, values)
          }}
        />
      )}
    </>
  )
}
