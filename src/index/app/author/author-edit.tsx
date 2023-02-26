import { Tab } from "@headlessui/react"
import React, { Fragment, useState } from "react"
import { MdEdit } from "react-icons/md"
import { PostAuthor } from "../../models/api"
import { AudiobookSelectors } from "../../state/audiobook.selectors"
import { useAudiobookState } from "../../state/audiobook.state"
import { ColoredButton } from "../common/colored-button"
import { Dialog, DialogActions, DialogBody, DialogButtons, DialogContent } from "../common/dialog"
import { AuthorSearch } from "./author-search"
import { MetadataAuthor } from "../../models/metadata"
import { AuthorForm } from "./author-form"
import { Form, useForm } from "../../hooks/form"
import { toFormDate, toUnixTime } from "../../utils"

type EditAuthor = PostAuthor

const mergeMetaIntoAuthor = ({ ...author }: EditAuthor, meta: MetadataAuthor): EditAuthor => {
  author.biography = meta.biography || author.biography
  author.birthDate = meta.birthDate
  author.deathDate = meta.deathDate
  author.bornIn = meta.bornIn || author.bornIn
  author.image = meta.imageURL || author.image
  author.name = meta.name || author.name
  author.provider = meta.id.provider
  author.providerID = meta.id.itemID
  author.website = meta.website || author.website
  return author
}

export const AuthorEdit: React.VFC<{ author: EditAuthor; authorID: string }> = ({ author, authorID }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)
  const updateAuthor = useAudiobookState(AudiobookSelectors.updateAuthor)
  const form = useForm(author, {
    toForm: {
      birthDate: value => value && toFormDate(value),
      deathDate: value => value && toFormDate(value),
    },
    fromForm: {
      birthDate: value => (value ? toUnixTime(value) : null),
      deathDate: value => (value ? toUnixTime(value) : null),
    },
  })

  const closeModal = () => setIsOpen(false)
  const openModal = () => setIsOpen(true)

  return (
    <>
      <ColoredButton color="secondary" onClick={openModal}>
        <MdEdit className="mr-2" /> Edit
      </ColoredButton>
      <div></div>
      <Dialog closeModal={closeModal} isOpen={isOpen} dialogClass="min-h-[510px]" title="Edit Author">
        <Form
          form={form}
          onSubmit={values => {
            updateAuthor({
              ...values,
              id: authorID,
            })
            closeModal()
          }}
        >
          <DialogBody>
            <DialogContent>
              <Tab.Group selectedIndex={selectedTabIndex} onChange={index => setSelectedTabIndex(index)}>
                <Tab.List className="p-2-solid w-full rounded-md border-2 border-primary border-opacity-50">
                  <Tab as={Fragment}>
                    {({ selected }) => (
                      <button
                        className={`w-1/2 p-2 transition-colors focus:bg-active ${selected ? "bg-active-light" : ""}`}
                      >
                        Tags
                      </button>
                    )}
                  </Tab>
                  <Tab as={Fragment}>
                    {({ selected }) => (
                      <button
                        className={`w-1/2 border-l-2 border-primary border-opacity-50 p-2 transition-colors focus:bg-active ${
                          selected ? "bg-active-light" : ""
                        }`}
                      >
                        Lookup information
                      </button>
                    )}
                  </Tab>
                </Tab.List>
                <Tab.Panels className="mt-2">
                  <Tab.Panel className="rounded-md border-2 border-primary border-opacity-0 focus:border-opacity-20">
                    <AuthorForm />
                  </Tab.Panel>
                  <Tab.Panel>
                    <AuthorSearch
                      author={form.fields.name}
                      select={authorMeta => {
                        form.setFields(mergeMetaIntoAuthor(form.fields, authorMeta))
                        setSelectedTabIndex(0)
                      }}
                    />
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </DialogContent>
            <DialogActions>
              <DialogButtons closeModal={closeModal} />
            </DialogActions>
          </DialogBody>
        </Form>
      </Dialog>
    </>
  )
}

export default AuthorEdit
