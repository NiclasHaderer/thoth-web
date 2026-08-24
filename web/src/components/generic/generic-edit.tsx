import { ReactNode, useState } from "react"
import { Key } from "react-aria-components"
import { Dialog } from "@thoth/components/dialog"
import { Button } from "@thoth/components/ui/button"
import { DialogFooter } from "@thoth/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@thoth/components/ui/tabs"
import { Form, FormContext } from "@thoth/hooks/form.tsx"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function GenericEdit<T extends Record<string, any>>({
  form,
  onSubmit,
  title,
  information,
  search,
  isOpen,
  onOpenChange,
}: {
  form: FormContext<T>
  onSubmit: (values: T, closeModal: () => void) => void | Promise<void>
  title: string
  information: ReactNode
  search: (onSelect: () => void) => ReactNode
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [selectedTab, setSelectedTab] = useState<Key>("information")
  const [submitting, setSubmitting] = useState(false)

  // Reset on close, so the opener does not have to reach in here to get a pristine form.
  const setOpen = (open: boolean) => {
    if (!open) {
      form.restoreInitial()
      setSelectedTab("information")
    }
    onOpenChange(open)
  }

  const closeModal = () => setOpen(false)

  return (
    <Dialog isOpen={isOpen} onOpenChange={setOpen} title={title} className="sm:max-w-[85%] lg:max-w-4xl">
      <Form
        form={form}
        onSubmit={async values => {
          setSubmitting(true)
          try {
            await onSubmit(values, closeModal)
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
              {information}
            </TabsContent>
            <TabsContent id="lookup" shouldForceMount className="flex flex-col">
              {search(() => setSelectedTab("information"))}
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
    </Dialog>
  )
}
