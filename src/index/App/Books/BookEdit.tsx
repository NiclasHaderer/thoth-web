import { Tab } from "@headlessui/react"
import React, { Fragment, useEffect, useState } from "react"
import {
  MdCollectionsBookmark,
  MdEdit,
  MdEvent,
  MdFormatListNumbered,
  MdLanguage,
  MdPerson,
  MdSearch,
} from "react-icons/md"
import { BookModel } from "../../API/models/Audiobook"
import { AudiobookSelectors } from "../../State/Audiobook.Selectors"
import { useAudiobookState } from "../../State/Audiobook.State"
import { ColoredButton } from "../Common/ColoredButton"
import { Dialog } from "../Common/Dialog"
import { FormikInput } from "../Common/Input"
import { BookSearch } from "./BookMatch"

export const BookEdit: React.VFC<{ book: BookModel & { id: string } }> = ({ book: _bookProp }) => {
  let [isOpen, setIsOpen] = useState(false)
  const [book, setBook] = useState(_bookProp)
  useEffect(() => {
    setBook(_bookProp)
  }, [_bookProp])

  const updateBook = useAudiobookState(AudiobookSelectors.updateBook)
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)

  const closeModal = () => setIsOpen(false)
  const openModal = () => setIsOpen(true)

  return (
    <>
      <ColoredButton color="secondary" onClick={openModal}>
        <MdEdit className="mr-2" /> Edit
      </ColoredButton>
      <Dialog
        closeModal={closeModal}
        isOpen={isOpen}
        dialogClass="min-h-[510px]"
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
          <Tab.Group selectedIndex={selectedTabIndex} onChange={index => setSelectedTabIndex(index)}>
            <Tab.List className="p-2-solid w-full rounded-md border-2 border-primary border-opacity-50">
              <Tab as={Fragment}>
                {({ selected }) => (
                  <button
                    className={`w-1/2 p-2 transition-colors focus:bg-active ${selected ? "bg-light-active" : ""}`}
                  >
                    Tags
                  </button>
                )}
              </Tab>
              <Tab as={Fragment}>
                {({ selected }) => (
                  <button
                    className={`w-1/2 border-l-2 border-primary border-opacity-50 p-2 transition-colors focus:bg-active ${
                      selected ? "bg-light-active" : ""
                    }`}
                  >
                    Fix Match
                  </button>
                )}
              </Tab>
            </Tab.List>
            <Tab.Panels className="mt-2">
              <Tab.Panel className="rounded-md border-2 border-primary border-opacity-0 focus:border-opacity-20">
                <BookForm />
              </Tab.Panel>
              <Tab.Panel>
                <BookSearch
                  book={book.title}
                  author={book.author.name}
                  select={bookMeta => {
                    setSelectedTabIndex(0)
                  }}
                />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
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
