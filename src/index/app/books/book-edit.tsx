import { Tab } from "@headlessui/react"
import React, { Fragment, useEffect, useRef, useState } from "react"
import {
  MdCollectionsBookmark,
  MdEdit,
  MdEvent,
  MdFormatListNumbered,
  MdImageNotSupported,
  MdLanguage,
  MdPerson,
  MdSearch,
} from "react-icons/md"
import { BookModel, PatchBook } from "../../models/api"
import { AudiobookSelectors } from "../../state/audiobook.selectors"
import { useAudiobookState } from "../../state/audiobook.state"
import { ColoredButton } from "../common/colored-button"
import { Dialog } from "../common/dialog"
import { FormikInput } from "../common/formik-input"
import { BookSearch } from "./book-search"
import { MetadataBook } from "../../models/metadata"
import { useField } from "formik"
import { toBase64 } from "../../helpers"
import { ResponsiveImage } from "../common/responsive-image"

const HtmlEditor = React.lazy(() => import("../common/editor"))

const mergeMetaIntoBook = ({ ...book }: PatchBook, meta: MetadataBook): PatchBook => {
  // TODO fix
  book.title = meta.title || book.title
  // book.author = meta.author?.name || book.author
  // book.cover = meta.image || book.cover
  book.description = meta.description || book.description
  book.narrator = meta.narrator || book.narrator
  // book.providerID = meta.id || book.providerID
  // book.series = meta.series?.name || book.series
  // book.seriesIndex = meta.series?.index || book.seriesIndex
  return book
}

const toPatchBook = (book: BookModel): PatchBook => {
  // TODO
  return book as unknown as PatchBook
}

export const BookEdit: React.VFC<{ book: BookModel }> = ({ book: _bookProp }) => {
  let [isOpen, setIsOpen] = useState(false)
  const [book, setBook] = useState(toPatchBook(_bookProp))
  useEffect(() => {
    setBook(toPatchBook(_bookProp))
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
        values={book}
        onSubmit={values => {
          updateBook({ ...values, id: _bookProp.id })
          closeModal()
        }}
      >
        <>
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
                <BookForm />
              </Tab.Panel>
              <Tab.Panel>
                <BookSearch
                  book={book.title}
                  authors={book.authors}
                  select={bookMeta => {
                    setBook(mergeMetaIntoBook(book, bookMeta))
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

const BookForm = () => {
  const descriptionAccessor: keyof PatchBook = "description"
  const imageAccessor: keyof PatchBook = "cover"

  const imageRef = useRef<HTMLInputElement>(null)

  const [description, , descriptionHelpers] = useField(descriptionAccessor)
  const [image, , imageHelpers] = useField(imageAccessor)

  return (
    <>
      <div className="flex flex-col md:flex-row">
        <div className="flex cursor-pointer items-center justify-center pr-2">
          <div className="flex flex-col justify-center">
            {image.value ? (
              <ResponsiveImage
                className="h-52 min-h-52 w-52 min-w-52 rounded-md"
                src={image.value}
                alt="book"
                onClick={() => imageRef.current && imageRef.current.click()}
              />
            ) : (
              <MdImageNotSupported
                className="h-52 w-52 cursor-pointer  rounded-md"
                onClick={() => imageRef.current && imageRef.current.click()}
              />
            )}
            <input
              className="hidden"
              ref={imageRef}
              type="file"
              accept="image/*"
              onChange={async () => {
                const file = await imageRef.current!.files![0]
                const base64 = await toBase64(file)
                imageHelpers.setValue(base64)
              }}
            />
            <ColoredButton
              color="secondary"
              className="mt-2 self-center"
              onClick={() => imageRef.current && imageRef.current.click()}
            >
              Upload image
            </ColoredButton>
          </div>
        </div>
        <div>
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
        </div>
      </div>
      <label className="flex items-center">
        <React.Suspense fallback={<div />}>
          <HtmlEditor
            className="flex-grow"
            placeholder="Description"
            value={description.value}
            onChange={descriptionHelpers.setValue}
          />
        </React.Suspense>
      </label>
    </>
  )
}
export default BookEdit
