"use client"

import React, { useState } from "react"
import { MdEdit, MdLocalLibrary, MdPerson } from "react-icons/md"
import { ColoredButton } from "@thoth/components/colored-button"
import { Dialog, DialogActions, DialogBody, DialogButtons } from "@thoth/components/dialog"
import { ManagedInput } from "@thoth/components/input/managed-input"
import { Form, useForm } from "@thoth/hooks/form"
import { MdFolderManaged } from "@thoth/components/icons/managed"
import { SelectLine } from "@thoth/components/input/select-line"

export default function ServerSettingsOutlet() {
  return (
    <>
      <h1 className="mb-4  text-2xl">Settings</h1>

      <h2 className="mb-2 text-xl">Manage Users</h2>
      <UserManager />

      <h2 className="mb-2 mt-4 text-xl">Manage Libraries</h2>
      <LibraryManager />
    </>
  )
}

const LibraryManager = () => {
  return (
    <>
      <div className="flex flex-col"></div>
    </>
  )
}

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

const UserManager = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [users, setUsers] = useState(USERS)
  const form = useForm({
    username: "",
    permissions: "",
    libraries: [] as string[],
    mode: "create" as "create" | "edit",
    id: "string",
  })

  return (
    <>
      <p>
        Give your friends and family access to the content on your Thoth Server. You can manage access to libraries or
        give them elevated permissions here.
      </p>
      <div className="flex flex-col">
        <table className="table-auto overflow-hidden rounded">
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
              </>
            }
          </tbody>
        </table>
      </div>
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
    </>
  )
}
