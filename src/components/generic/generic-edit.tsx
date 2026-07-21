import { FC, useState } from "react"
import { Key } from "react-aria-components"
import { MdEdit } from "react-icons/md"
import { Dialog, DialogBody, DialogButtons, DialogFooter } from "@thoth/components/dialog.tsx"
import { Button } from "@thoth/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@thoth/components/ui/tabs"
import { Form, FormContext } from "@thoth/hooks/form.tsx"

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- matches FormContext's Record<string, any> so interface-typed models (no index signature) are accepted
export function GenericEdit<T extends Record<string, any>>({
  form,
  onSubmit,
  title,
  InformationDisplay,
  Search,
}: {
  form: FormContext<T>
  onSubmit: (values: T, closeModal: () => void) => void
  title: string
  InformationDisplay: FC
  Search: FC<{ onSelect: () => void }>
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState<Key>("information")

  const closeModal = () => setIsOpen(false)
  const openModal = () => setIsOpen(true)

  return (
    <>
      <Button variant="secondary" onPress={openModal}>
        <MdEdit className="mr-2" /> Edit
      </Button>
      <Dialog closeModal={closeModal} isOpen={isOpen} dialogClass="min-h-[510px]" title={title}>
        <Form form={form} onSubmit={values => onSubmit(values, closeModal)}>
          <DialogBody>
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
          </DialogBody>
          <DialogFooter>
            <DialogButtons closeModal={closeModal} />
          </DialogFooter>
        </Form>
      </Dialog>
    </>
  )
}
