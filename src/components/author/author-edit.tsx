import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react"
import { FC, Fragment, useState } from "react"
import { MdEdit } from "react-icons/md"
import { AuthorApiModel, MetadataAuthor, UUID } from "@thoth/client"
import { ColoredButton } from "@thoth/components/colored-button"
import { Dialog, DialogActions, DialogBody, DialogButtons } from "@thoth/components/dialog"
import { Form, useForm } from "../../hooks/form"
import { useAudiobookState } from "../../state/audiobook.state"
import { toFormDate } from "../../utils/utils"
import { AuthorForm } from "./author-form"
import { AuthorSearch } from "./author-search"

const mergeMetaIntoAuthor = ({ ...author }: AuthorApiModel, meta: MetadataAuthor): AuthorApiModel => {
  author.biography = meta.biography || author.biography
  author.birthDate = meta.birthDate || author.birthDate
  author.deathDate = meta.deathDate || author.deathDate
  author.bornIn = meta.bornIn || author.bornIn
  author.image = meta.imageURL || author.image
  author.name = meta.name || author.name
  author.provider = meta.id.provider
  author.providerID = meta.id.itemID
  author.website = meta.website || author.website
  return author
}

export const AuthorEdit: FC<{ author: AuthorApiModel; authorId: UUID; libraryId: UUID }> = ({
  author,
  authorId,
  libraryId,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)

  const updateAuthor = useAudiobookState(s => s.updateAuthor)
  const form = useForm(author, {
    toForm: {
      birthDate: value => value && toFormDate(value),
      deathDate: value => value && toFormDate(value),
    },
  })

  const closeModal = () => setIsOpen(false)
  const openModal = () => setIsOpen(true)

  return (
    <>
      <ColoredButton color="secondary" onClick={openModal}>
        <MdEdit className="mr-2" /> Edit
      </ColoredButton>
      <Dialog closeModal={closeModal} isOpen={isOpen} dialogClass="min-h-[510px]" title="Edit Author">
        <DialogBody>
          <Form
            form={form}
            onSubmit={async values => {
              await updateAuthor({ libraryId, id: authorId }, values)
              closeModal()
            }}
          >
            <TabGroup selectedIndex={selectedTabIndex} onChange={index => setSelectedTabIndex(index)}>
              <TabList className="p-2-solid w-full">
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={`w-1/2 rounded-l-md p-2 transition-colors focus:bg-active ${selected ? "bg-active-light" : ""}`}
                    >
                      Tags
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
                      Lookup information
                    </button>
                  )}
                </Tab>
              </TabList>
              <TabPanels className="mt-2">
                <TabPanel tabIndex={-1}>
                  <AuthorForm form={form} />
                </TabPanel>
                <TabPanel tabIndex={-1}>
                  <AuthorSearch
                    libraryId={libraryId}
                    authorSearch={form.fields.name}
                    select={authorMeta => {
                      form.setAllFields(mergeMetaIntoAuthor(form.fields, authorMeta))
                      setSelectedTabIndex(0)
                    }}
                  />
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

export default AuthorEdit
