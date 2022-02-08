import { Tab } from "@headlessui/react"
import React, { useState } from "react"
import {
  MdCollectionsBookmark,
  MdEdit,
  MdEvent,
  MdFormatListNumbered,
  MdLanguage,
  MdPerson,
  MdSearch,
} from "react-icons/md"
import { BookModel } from "../../API/Audiobook"
import { AudiobookSelectors } from "../../State/Audiobook.Selectors"
import { useAudiobookState } from "../../State/Audiobook.State"
import { ColoredButton } from "../Common/ColoredButton"
import { Dialog, MyModal } from "../Common/Dialog"
import { FormikInput } from "../Common/Input"

export const BookEdit: React.VFC<{ book: Partial<BookModel> & { id: string } }> = ({ book }) => {
  let [isOpen, setIsOpen] = useState(false)
  const updateBook = useAudiobookState(AudiobookSelectors.updateBook)

  const closeModal = () => setIsOpen(false)
  const openModal = () => setIsOpen(true)

  return (
    <>
      <MyModal />
      <ColoredButton color="secondary" onClick={openModal}>
        <MdEdit className="mr-2" /> Edit
      </ColoredButton>
      <Dialog
        closeModal={closeModal}
        isOpen={isOpen}
        title="Edit Book"
        buttons={
          <>
            <ColoredButton type="submit">Submit</ColoredButton>
            <ColoredButton type="button" color="secondary" onClick={closeModal}>
              Cancel
            </ColoredButton>
          </>
        }
        values={{
          title: book.title,
          author: book.author?.name || "",
          language: book.language || "",
          narrator: book.narrator || "",
          series: book.series?.title || "",
          year: book.year || undefined,
          seriesIndex: book.seriesIndex || undefined,
        }}
        onSubmit={values => {
          // TODO
          //updateBook({
          //  id: book.id,
          //  asin: book.asin,
          //  cover: book.cover,
          //  description: book.description,
          //  title: values.title || book.title,
          //  author: values.author || book.author!.name,
          //  language: values.language || null,
          //  narrator: values.narrator || null,
          //  series: values.series || null,
          //  year: values.year || null,
          //  seriesIndex: values.seriesIndex || null,
          //})
          //closeModal()
        }}
      >
        <>
          <Tab.Group>
            <Tab.List>
              <Tab>Tab 1</Tab>
              <Tab>Tab 2</Tab>
              <Tab>Tab 3</Tab>
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel>Content 1</Tab.Panel>
              <Tab.Panel>Content 2</Tab.Panel>
              <Tab.Panel>Content 3</Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
          <BookForm />
        </>
      </Dialog>
    </>
  )
}

const BookForm = () => (
  <>
    <FormikInput name="title" labelClassName="w-28" label="Title" icon={<MdSearch />} />
    <FormikInput name="author" labelClassName="w-28" label="Author" icon={<MdPerson />} />
    <FormikInput name="language" labelClassName="w-28" label="Language" icon={<MdLanguage />} />
    <FormikInput name="narrator" labelClassName="w-28" label="Narrator" icon={<MdPerson />} />
    <FormikInput name="series" labelClassName="w-28" label="Series" icon={<MdCollectionsBookmark />} />
    <FormikInput name="year" labelClassName="w-28" type="number" label="Year" icon={<MdEvent />} />
    <FormikInput
      name="seriesIndex"
      labelClassName="w-28"
      type="number"
      label="Series Index"
      icon={<MdFormatListNumbered />}
    />
  </>
)
