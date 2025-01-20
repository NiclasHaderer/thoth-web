import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react"
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
import { AudiobookSelectors } from "../../state/audiobook.selectors"
import { useAudiobookState } from "../../state/audiobook.state"
import { BookSearch } from "./book-search"
import { toBase64 } from "../../utils/utils"
import { Form, useField, useForm } from "../../hooks/form"
import { BookModel, MetadataBook, PartialBookApiModel, UUID } from "@thoth/client"
import { ColoredButton } from "@thoth/components/colored-button"
import { Dialog, DialogButtons } from "@thoth/components/dialog"
import { ResponsiveImage } from "@thoth/components/responsive-image"
import { ManagedInput } from "@thoth/components/input/managed-input"
import HtmlEditor from "../html-editor"

const mergeMetaIntoBook = ({ ...book }: PartialBookApiModel, meta: MetadataBook): PartialBookApiModel => {
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

const toPatchBook = (book: BookModel): PartialBookApiModel => {
  // TODO
  return book as unknown as PartialBookApiModel
}

export const BookEdit: React.FC<{ book: BookModel; bookId: UUID }> = ({ book: _bookProp, bookId }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)
  const [book, setBook] = useState(toPatchBook(_bookProp))
  const updateBook = useAudiobookState(s => s.updateBook)
  const libraryId = useAudiobookState(AudiobookSelectors.selectedLibraryId)!
  const form = useForm(book)

  useEffect(() => setBook(toPatchBook(_bookProp)), [_bookProp])

  const closeModal = () => setIsOpen(false)
  const openModal = () => setIsOpen(true)

  return (
    <>
      <ColoredButton color="secondary" onClick={openModal}>
        <MdEdit className="mr-2" /> Edit
      </ColoredButton>
      <Dialog closeModal={closeModal} isOpen={isOpen} dialogClass="min-h-[510px]" title="Edit Book">
        <Form
          form={form}
          onSubmit={async values => {
            await updateBook({ libraryId, id: bookId }, values)
            closeModal()
          }}
        >
          <TabGroup selectedIndex={selectedTabIndex} onChange={index => setSelectedTabIndex(index)}>
            <TabList className="p-2-solid w-full rounded-md border-2 border-primary border-opacity-50">
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
            </TabList>
            <TabPanels className="mt-2">
              <TabPanel className="rounded-md border-2 border-primary border-opacity-0 focus:border-opacity-20">
                <BookForm />
              </TabPanel>
              <TabPanel>
                <BookSearch
                  book={book.title}
                  authors={book.authors}
                  select={bookMeta => {
                    setBook(mergeMetaIntoBook(book, bookMeta))
                    setSelectedTabIndex(0)
                  }}
                />
              </TabPanel>
            </TabPanels>
          </TabGroup>
          <DialogButtons closeModal={closeModal} />
        </Form>
      </Dialog>
    </>
  )
}

const BookForm = () => {
  const imageRef = useRef<HTMLInputElement>(null)

  const { value: descriptionValue, formSetValue: setDescriptionValue } = useField<PartialBookApiModel, "description">(
    "description"
  )
  const { value: imageValue, formSetValue: setImageValue } = useField<PartialBookApiModel, "cover">("cover")

  return (
    <>
      <div className="flex flex-col md:flex-row">
        <div className="flex cursor-pointer items-center justify-center pr-2">
          <div className="flex flex-col justify-center">
            {imageValue ? (
              <ResponsiveImage
                className="h-52 min-h-52 w-52 min-w-52 rounded-md"
                src={imageValue}
                alt="book"
                onClick={() => imageRef.current && imageRef.current.click()}
              />
            ) : (
              <MdImageNotSupported
                className="h-52 w-52 cursor-pointer rounded-md"
                onClick={() => imageRef.current && imageRef.current.click()}
              />
            )}
            <input
              className="hidden"
              ref={imageRef}
              type="file"
              accept="image/*"
              onChange={async () => {
                const file = imageRef.current!.files![0]
                const base64 = await toBase64(file)
                setImageValue(base64)
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
          <ManagedInput name="title" labelClassName="w-28" label="Title" leftIcon={<MdSearch />} />
          <ManagedInput name="author" labelClassName="w-28" label="Author" leftIcon={<MdPerson />} />
          <ManagedInput name="language" labelClassName="w-28" label="Language" leftIcon={<MdLanguage />} />
          <ManagedInput name="narrator" labelClassName="w-28" label="Narrator" leftIcon={<MdPerson />} />
          <ManagedInput name="series" labelClassName="w-28" label="Series" leftIcon={<MdCollectionsBookmark />} />
          <ManagedInput name="year" labelClassName="w-28" type="number" label="Year" leftIcon={<MdEvent />} />
          <ManagedInput
            name="seriesIndex"
            labelClassName="w-28"
            type="number"
            label="Series Index"
            leftIcon={<MdFormatListNumbered />}
          />
        </div>
      </div>
      <label className="flex items-center">
        <HtmlEditor
          className="flex-grow"
          placeholder="Description"
          value={descriptionValue}
          onChange={setDescriptionValue}
        />
      </label>
    </>
  )
}
