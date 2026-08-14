import { UUID } from "crypto"
import { FolderCogIcon, LibraryIcon, UserIcon } from "lucide-react"
import { FC, useMemo } from "react"
import { Dialog } from "@thoth/components/dialog"
import { ManagedInput } from "@thoth/components/input/managed-input"
import { SelectLine } from "@thoth/components/input/select-line"
import { Button } from "@thoth/components/ui/button"
import { DialogFooter } from "@thoth/components/ui/dialog"
import { Tooltip, TooltipTrigger } from "@thoth/components/ui/tooltip"
import { Form, FormContext } from "@thoth/hooks/form"
import { useLibraries } from "@thoth/queries/libraries"

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
  const { data: _libraries } = useLibraries()
  const libraries = useMemo(() => (_libraries ?? []).map(l => ({ label: l.name, value: l.id })), [_libraries])

  return (
    <Dialog isOpen={isOpen} onOpenChange={setIsOpen} title="Edit User">
      <Form form={form} onSubmit={(user: UserFormValues) => onSubmit(user)}>
        <ManagedInput required={true} name="username" labelClassName="w-28" label="Name" leftIcon={<UserIcon />} />
        <SelectLine
          options={[
            { value: true, label: "Yes" },
            { value: false, label: "No" },
          ]}
          title="Is Admin"
          name="admin"
          labelClassName="w-28"
          label="Admin"
          icon={<FolderCogIcon />}
        />
        {form.fields.admin ? (
          <TooltipTrigger>
            <div>
              <SelectLine
                options={libraries}
                multiple={true}
                title="All libraries"
                name="libraries"
                labelClassName="w-28"
                label="Libraries"
                icon={<LibraryIcon />}
                disabled
              />
            </div>
            <Tooltip>Admins have access to all libraries.</Tooltip>
          </TooltipTrigger>
        ) : (
          <SelectLine
            options={libraries}
            multiple={true}
            title="Libraries"
            name="libraries"
            labelClassName="w-28"
            label="Libraries"
            icon={<LibraryIcon />}
          />
        )}
        <DialogFooter>
          <Button type="button" variant="secondary" onPress={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button type="submit">Submit</Button>
        </DialogFooter>
      </Form>
    </Dialog>
  )
}
