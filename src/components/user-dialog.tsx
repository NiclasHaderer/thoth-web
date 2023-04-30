import React, { FC } from "react"
import { Form, FormContext } from "@thoth/hooks/form"
import { MdLocalLibrary, MdPerson } from "react-icons/md"
import { Dialog, DialogActions, DialogBody, DialogButtons } from "@thoth/components/dialog"
import { ManagedInput } from "@thoth/components/input/managed-input"
import { SelectLine } from "@thoth/components/input/select-line"
import { MdFolderManaged } from "@thoth/components/icons/managed"

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
          <ManagedInput required={true} name="username" labelClassName="w-28" label="Name" leftIcon={<MdPerson />} />
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
