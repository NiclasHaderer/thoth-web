import { PencilIcon } from "lucide-react"
import { FC, useState } from "react"
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
  InformationDisplay,
  Search,
  Trigger,
}: {
  form: FormContext<T>
  onSubmit: (values: T, closeModal: () => void) => void
  title: string
  InformationDisplay: FC
  Search: FC<{ onSelect: () => void }>
  Trigger?: FC<{ open: () => void }>
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState<Key>("information")

  const closeModal = () => setIsOpen(false)

  return (
    <>
      {Trigger ? (
        <Trigger open={() => setIsOpen(true)} />
      ) : (
        <Button variant="secondary" onPress={() => setIsOpen(true)} className="max-sm:w-11 max-sm:px-0">
          <PencilIcon className="sm:mr-2" />
          <span className="max-sm:sr-only">Edit</span>
        </Button>
      )}
      <Dialog isOpen={isOpen} onOpenChange={setIsOpen} title={title}>
        <Form form={form} onSubmit={values => onSubmit(values, closeModal)}>
          <Tabs selectedKey={selectedTab} onSelectionChange={setSelectedTab}>
            <TabsList className="w-full">
              <TabsTrigger id="information" className="w-1/2">
                Information
              </TabsTrigger>
              <TabsTrigger id="lookup" className="w-1/2">
                Lookup Information
              </TabsTrigger>
            </TabsList>
            <TabsContent id="information" className="mt-2">
              <InformationDisplay />
            </TabsContent>
            <TabsContent id="lookup" className="mt-2">
              <Search onSelect={() => setSelectedTab("information")} />
            </TabsContent>
          </Tabs>
          <DialogFooter>
            <Button type="button" variant="secondary" onPress={closeModal}>
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </Form>
      </Dialog>
    </>
  )
}
