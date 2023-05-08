import React, { FC, useMemo } from "react"
import { Form, useForm } from "@thoth/hooks/form"
import { MdLocalLibrary, MdPerson } from "react-icons/md"
import { Dialog, DialogActions, DialogBody, DialogButtons } from "@thoth/components/dialog"
import { ManagedInput } from "@thoth/components/input/managed-input"
import { SelectLine } from "@thoth/components/input/select-line"
import { MdFolderManaged } from "@thoth/components/icons/managed"
import { ModifyUser, UserModel } from "@thoth/client"
import { useAudiobookState } from "@thoth/state/audiobook.state"
import { AudiobookSelectors } from "@thoth/state/audiobook.selectors"

export const UserDialog: FC<{
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  user: UserModel
  onModifyUser: (user: ModifyUser) => void
}> = ({ isOpen, setIsOpen, onModifyUser, user }) => {
  const _libraries = useAudiobookState(AudiobookSelectors.libraries)
  const libraries = useMemo(() => _libraries.map(l => ({ label: l.name, value: l.id })), [_libraries])

  const form = useForm({
    username: user.username,
    permissions: user.admin ? "admin" : user.edit ? "editor" : "viewer",
    libraries: user.libraries.map(l => l.id),
    id: user.id,
  })

  return (
    <Dialog isOpen={isOpen} closeModal={() => setIsOpen(false)} title={"Edit User"}>
      <Form
        form={form}
        onSubmit={values => {
          onModifyUser({
            username: values.username,
            admin: values.permissions === "admin",
            edit: values.permissions === "editor" || values.permissions === "admin",
          })
        }}
      >
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
            options={libraries}
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
