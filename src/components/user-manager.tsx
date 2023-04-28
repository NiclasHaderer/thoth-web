import React, { FC, useState } from "react"
import { Form, FormContext, useForm } from "@thoth/hooks/form"
import { MdEdit, MdLocalLibrary, MdPerson } from "react-icons/md"
import { ColoredButton } from "@thoth/components/colored-button"
import { Dialog, DialogActions, DialogBody, DialogButtons } from "@thoth/components/dialog"
import { ManagedInput } from "@thoth/components/input/managed-input"
import { SelectLine } from "@thoth/components/input/select-line"
import { MdFolderManaged } from "@thoth/components/icons/managed"

const USERS = [
  {
    id: "1",
    username: "Test",
    permissions: "admin",
    libraries: ["Audiobooks", "Audiobooks(en)"],
  },
  {
    id: "2",
    username: "Test",
    permissions: "admin",
    libraries: ["Audiobooks", "Audiobooks(en)"],
  },
]

export const UserManager = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [users, setUsers] = useState(USERS)
  const form = useForm({
    username: "",
    permissions: "",
    libraries: [] as string[],
    mode: "create" as "create" | "edit",
    id: "",
  })

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
              {users.map(user => (
                <tr
                  className="group cursor-pointer odd:bg-active-light hover:bg-active"
                  key={user.id}
                  onClick={() => {
                    form.setFields({ ...user, mode: "edit" })
                    setIsOpen(true)
                  }}
                >
                  <td className="flex items-center pl-2">
                    <MdPerson className="mr-4 h-8 w-8" />
                    {user.username}
                  </td>
                  <td>{user.permissions}</td>
                  <td className="pr-2">{user.libraries.join(", ")}</td>
                  <td className="pr-2">
                    <MdEdit className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
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
      <div className="flex justify-end pt-2">
        <ColoredButton
          onClick={() => {
            form.restoreInitial()
            setIsOpen(true)
          }}
          innerClassName="!p-.5"
        >
          Create new User
        </ColoredButton>
      </div>
      <UserDialog isOpen={isOpen} setIsOpen={setIsOpen} form={form} />
    </>
  )
}

export const UserDialog: FC<{
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  form: FormContext<{
    username: string
    permissions: string
    libraries: string[]
    mode: "create" | "edit"
    id: string
  }>
}> = ({ isOpen, setIsOpen, form }) => {
  return (
    <Dialog
      isOpen={isOpen}
      closeModal={() => setIsOpen(false)}
      title={form.fields.mode === "create" ? "Create new User" : "Edit User"}
    >
      <Form form={form}>
        <DialogBody>
          <ManagedInput required={true} name="username" labelClassName="w-28" label="Name" icon={<MdPerson />} />
          <SelectLine
            options={["viewer", "editor", "admin"]}
            title={"Permissions"}
            name="permissions"
            labelClassName="w-28"
            label="Permissions"
            icon={<MdFolderManaged />}
          />
          <SelectLine
            options={["Audiobooks", "Audiobooks(en)"]}
            multiple={true}
            title={"Libraries"}
            name="libraries"
            labelClassName="w-28"
            label="Libraries"
            icon={<MdLocalLibrary />}
          />
        </DialogBody>
        <DialogActions>
          <DialogButtons closeModal={() => setIsOpen(false)} />
        </DialogActions>
      </Form>
    </Dialog>
  )
}
