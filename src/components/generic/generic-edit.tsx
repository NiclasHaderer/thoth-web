import { PencilIcon } from "lucide-react"
import { ReactNode, useState } from "react"
import { Key } from "react-aria-components"
import { Dialog } from "@thoth/components/dialog"
import { Button } from "@thoth/components/ui/button"
import { DialogFooter } from "@thoth/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@thoth/components/ui/tabs"
import { Form, FormContext } from "@thoth/hooks/form.tsx"

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- matches FormContext's Record<string, any> so interface-typed models (no index signature) are accepted
export function GenericEdit<T extends Record<string, any>>({
  form,
  onSubmit,
  title,
  information,
  search,
  trigger,
}: {
  form: FormContext<T>
  onSubmit: (values: T, closeModal: () => void) => void | Promise<void>
  title: string
  information: ReactNode
  search: (onSelect: () => void) => ReactNode
  trigger?: (open: () => void) => ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState<Key>("information")
  const [submitting, setSubmitting] = useState(false)

  const openModal = () => {
    form.restoreInitial()
    setSelectedTab("information")
    setIsOpen(true)
  }
  const closeModal = () => setIsOpen(false)

  return (
    <>
      {trigger ? (
        trigger(openModal)
      ) : (
        <Button variant="secondary" onPress={openModal} className="max-sm:w-11 max-sm:px-0">
          <PencilIcon className="sm:mr-2" />
          <span className="max-sm:sr-only">Edit</span>
        </Button>
      )}
      <Dialog isOpen={isOpen} onOpenChange={setIsOpen} title={title} className="sm:max-w-[85%] lg:max-w-4xl">
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
    </>
  )
}
