import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react"
import { FC, Fragment, useState } from "react"
import { MdEdit } from "react-icons/md"
import { ColoredButton } from "@thoth/components/colored-button.tsx"
import { Dialog, DialogActions, DialogBody, DialogButtons } from "@thoth/components/dialog.tsx"
import { Form, FormContext } from "@thoth/hooks/form.tsx"

export function GenericEdit<T extends Record<string, any>>({
  form,
  onSubmit,
  title,
  InformationDisplay,
  Search,
}: {
  form: FormContext<T>
  onSubmit: (values: T, closeModal: () => void) => any
  title: string
  InformationDisplay: FC
  Search: FC<{ onSelect: () => void }>
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)

  const closeModal = () => setIsOpen(false)
  const openModal = () => setIsOpen(true)

  return (
    <>
      <ColoredButton color="secondary" onClick={openModal}>
        <MdEdit className="mr-2" /> Edit
      </ColoredButton>
      <Dialog closeModal={closeModal} isOpen={isOpen} dialogClass="min-h-[510px]" title={title}>
        <DialogBody>
          <Form form={form} onSubmit={values => onSubmit(values, closeModal)}>
            <TabGroup selectedIndex={selectedTabIndex} onChange={index => setSelectedTabIndex(index)}>
              <TabList className="p-2-solid w-full">
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={`w-1/2 rounded-l-md p-2 transition-colors focus:bg-active ${selected ? "bg-active-light" : ""}`}
                    >
                      Information
                    </button>
                  )}
                </Tab>
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={`w-1/2 rounded-r-md p-2 transition-colors focus:bg-active ${
                        selected ? "bg-active-light" : ""
                      }`}
                    >
                      Lookup Information
                    </button>
                  )}
                </Tab>
              </TabList>
              <TabPanels className="mt-2">
                <TabPanel tabIndex={-1}>
                  <InformationDisplay />
                </TabPanel>
                <TabPanel tabIndex={-1}>
                  <Search onSelect={() => setSelectedTabIndex(0)} />
                </TabPanel>
              </TabPanels>
            </TabGroup>
            <DialogActions>
              <DialogButtons closeModal={closeModal} />
            </DialogActions>
          </Form>
        </DialogBody>
      </Dialog>
    </>
  )
}
