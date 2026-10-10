/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode, useState } from "react"
import { Key } from "react-aria-components"
import { TitledDialog } from "@thoth/components/titled-dialog"
import { Button } from "@thoth/components/ui/button"
import { DialogFooter } from "@thoth/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@thoth/components/ui/tabs"
import { Form, FormContext, FormOptions, useForm } from "@thoth/hooks/use-form.tsx"

interface EditSessionProps<T extends Record<string, any>> {
  initial: T
  options?: FormOptions<T>
  onSubmit: (changes: Partial<T>, closeModal: () => void) => void | Promise<void>
  information: (form: FormContext<T>) => ReactNode
  search: (form: FormContext<T>, onSelect: () => void) => ReactNode
}

export function GenericEdit<T extends Record<string, any>>({
  title,
  isOpen,
  onOpenChange,
  ...session
}: EditSessionProps<T> & {
  title: string
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <TitledDialog isOpen={isOpen} onOpenChange={onOpenChange} title={title} className="sm:max-w-[85%] lg:max-w-4xl">
      <EditSession {...session} closeModal={() => onOpenChange(false)} />
    </TitledDialog>
  )
}

function EditSession<T extends Record<string, any>>({
  initial,
  options,
  onSubmit,
  information,
  search,
  closeModal,
}: EditSessionProps<T> & { closeModal: () => void }) {
  const form = useForm(initial, options)
  const [selectedTab, setSelectedTab] = useState<Key>("information")
  const [submitting, setSubmitting] = useState(false)

  return (
    <Form
      form={form}
      onSubmit={async () => {
        setSubmitting(true)
        try {
          await onSubmit(form.changedFields(), closeModal)
        } finally {
          setSubmitting(false)
        }
      }}
    >
      <Tabs selectedKey={selectedTab} onSelectionChange={setSelectedTab}>
        <TabsList className="w-full">
          <TabsTrigger id="information" className="w-1/2">
            Information
          </TabsTrigger>
          <TabsTrigger id="lookup" className="w-1/2">
            Find match
          </TabsTrigger>
        </TabsList>
        <div className="mt-2 grid [&>*]:col-start-1 [&>*]:row-start-1 [&>[inert]]:invisible">
          <TabsContent id="information" shouldForceMount>
            {information(form)}
          </TabsContent>
          <TabsContent id="lookup" shouldForceMount className="flex flex-col">
            {search(form, () => setSelectedTab("information"))}
          </TabsContent>
        </div>
      </Tabs>
      <DialogFooter>
        <Button type="button" variant="secondary" onPress={closeModal}>
          Cancel
        </Button>
        <Button type="submit" isDisabled={submitting}>
          Submit
        </Button>
      </DialogFooter>
    </Form>
  )
}
