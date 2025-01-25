import { FC, useMemo } from "react"
import { Form, useForm } from "@thoth/hooks/form"
import { MdLocalLibrary, MdPerson } from "react-icons/md"
import { Dialog, DialogActions, DialogBody, DialogButtons } from "@thoth/components/dialog"
import { ManagedInput } from "@thoth/components/input/managed-input"
import { SelectLine } from "@thoth/components/input/select-line"
import { MdFolderManaged } from "@thoth/components/icons/managed"
import { ThothUser, UserPermissionsModel } from "@thoth/client"
import { useAudiobookState } from "@thoth/state/audiobook.state"
import { AudiobookSelectors } from "@thoth/state/audiobook.selectors"
import { UUID } from "crypto"

export const UserDialog: FC<{
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  user: ThothUser<UUID, UserPermissionsModel>
  onModifyUser: (id: UUID, user: "no-proper-type-defined") => void
}> = ({ isOpen, setIsOpen, onModifyUser, user }) => {
  /* TODO this has to be implemented correctly */

  const _libraries = useAudiobookState(AudiobookSelectors.libraries)
  const libraries = useMemo(() => _libraries.map(l => ({ label: l.name, value: l.id })), [_libraries])

  const form = useForm({
    username: user.username,
    isAdmin: user.permissions.isAdmin,
    libraries: user.permissions.libraries.map(l => l.id),
    id: user.id,
  })

  return (
    <Dialog isOpen={isOpen} closeModal={() => setIsOpen(false)} title={"Edit User"}>
      <Form
        form={form}
        onSubmit={() => {
          onModifyUser(user.id, "no-proper-type-defined")
        }}
      >
        <DialogBody>
          <ManagedInput required={true} name="username" labelClassName="w-28" label="Name" leftIcon={<MdPerson />} />
          <SelectLine
            options={[true, false]}
            title="Is Admin"
            name="admin"
            labelClassName="w-28"
            label="admin"
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
