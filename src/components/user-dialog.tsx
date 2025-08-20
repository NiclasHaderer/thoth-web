import { UUID } from "crypto"
import { FC, useMemo } from "react"
import { MdLocalLibrary, MdPerson } from "react-icons/md"
import { Dialog, DialogActions, DialogBody, DialogButtons } from "@thoth/components/dialog"
import { MdFolderManaged } from "@thoth/components/icons/managed"
import { ManagedInput } from "@thoth/components/input/managed-input"
import { SelectLine } from "@thoth/components/input/select-line"
import { Form, FormContext } from "@thoth/hooks/form"
import { AudiobookSelectors } from "@thoth/state/audiobook.selectors"
import { useAudiobookState } from "@thoth/state/audiobook.state"

export interface UserFormValues {
  id?: UUID
  username: string
  admin: boolean
  libraries: UUID[]
}

export const UserDialog: FC<{
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  form: FormContext<UserFormValues>
  onSubmit: (user: UserFormValues) => void
}> = ({ isOpen, setIsOpen, onSubmit, form }) => {
  const _libraries = useAudiobookState(AudiobookSelectors.libraries)
  const libraries = useMemo(() => _libraries.map(l => ({ label: l.name, value: l.id })), [_libraries])
  const onSubmitInternal = (user: UserFormValues) => {
    if (form.hasErrors()) {
      return
    }
    onSubmit(user)
  }

  return (
    <Dialog isOpen={isOpen} closeModal={() => setIsOpen(false)} title={"Edit User"}>
      <Form form={form} onSubmit={onSubmitInternal}>
        <DialogBody>
          <ManagedInput required={true} name="username" labelClassName="w-28" label="Name" leftIcon={<MdPerson />} />
          <SelectLine
            options={[
              { value: true, label: "Yes" },
              { value: false, label: "No" },
            ]}
            title="Is Admin"
            name="admin"
            labelClassName="w-28"
            label="Admin"
            icon={<MdFolderManaged />}
          />
          {form.fields.admin ? (
            <></>
          ) : (
            <SelectLine
              options={libraries}
              multiple={true}
              title={"Libraries"}
              name="libraries"
              labelClassName="w-28"
              label="Libraries"
              icon={<MdLocalLibrary />}
            />
          )}
        </DialogBody>
        <DialogActions>
          <DialogButtons closeModal={() => setIsOpen(false)} />
        </DialogActions>
      </Form>
    </Dialog>
  )
}
