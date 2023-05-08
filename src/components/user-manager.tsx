import React, { useState } from "react"
import { useForm } from "@thoth/hooks/form"
import { MdEdit, MdPerson } from "react-icons/md"
import { ColoredButton } from "@thoth/components/colored-button"
import { UserDialog } from "@thoth/components/user-dialog"
import { useHttpRequest } from "@thoth/hooks/async-response"
import { Api, UserModel } from "@thoth/client"
import { useOnMount } from "@thoth/hooks/lifecycle"

export const UserManager = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { result: users, invoke } = useHttpRequest(Api.listUsers)
  const [userToEdit, setUserToEdit] = useState<UserModel>()
  useOnMount(() => invoke())

  return (
    <>
      <p>
        As an admin of our website, you now have the ability to create new user accounts and grant them access to our
        extensive library of audiobooks. With just a few clicks, you can easily manage user accounts and ensure that
        each user has the appropriate level of access to our audiobook server.
      </p>
      <table className="w-full table-auto overflow-hidden rounded">
        <thead>
          <tr className="bg-elevate">
            <th className="pl-2 text-left">Username</th>
            <th className="text-left">Role</th>
            <th className="text-left">Libraries</th>
            <th className="w-0 pr-2 text-left"></th>
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
                  <td className="flex items-center pl-2">
                    <MdPerson className="mr-4 h-8 w-8" />
                    {user.username}
                  </td>
                  <td>
                    {user.admin ? "Admin" : "User"}
                    {user.edit ? "(Editor)" : ""}
                  </td>
                  <td>{user.libraries.map(l => l.name).join(", ")}</td>
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
      {userToEdit && <UserDialog isOpen={isOpen} user={userToEdit} setIsOpen={setIsOpen} onModifyUser={console.log} />}
    </>
  )
}
