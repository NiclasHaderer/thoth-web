import { FC, useRef } from "react"
import { CiImageOff } from "react-icons/ci"
import { MdCollectionsBookmark, MdEvent, MdFormatListNumbered, MdLanguage, MdPerson, MdSearch } from "react-icons/md"
import { Book, BookUpdate, MetadataBook } from "@thoth/client"
import { ColoredButton } from "@thoth/components/colored-button"
import { GenericEdit } from "@thoth/components/generic/generic-edit.tsx"
import { ManagedInput } from "@thoth/components/input/managed-input"
import { ResponsiveImage } from "@thoth/components/responsive-image"
import { FormContext, useForm } from "../../hooks/form"
import { useAudiobookState } from "../../state/audiobook.state"
import { isUUID, toBase64, toFormDate } from "../../utils/utils"
import { HtmlEditor } from "../html-editor"
import { BookSearch } from "./book-search"

const mergeMetaIntoBook = ({ ...book }: BookUpdate, meta: MetadataBook): BookUpdate => {
  book.title = meta.title || book.title
  book.cover = meta.coverURL || book.cover
  book.description = meta.description || book.description
  book.narrator = meta.narrator || book.narrator
  book.language = meta.language || book.language
  book.releaseDate = meta.releaseDate || book.releaseDate
  book.isbn = meta.isbn || book.isbn
  book.publisher = meta.publisher || book.publisher
  book.providerRating = meta.providerRating ?? book.providerRating
  book.provider = meta.id.provider
  book.providerID = meta.id.itemID
  return book
}

const bookToUpdate = (book: Book): BookUpdate => {
  return {
    authors: book.authors.map(a => a.id),
    cover: book.coverID,
    description: book.description,
    isbn: book.isbn,
    language: book.language,
    narrator: book.narrator,
    provider: book.provider,
    providerID: book.providerID,
    providerRating: book.providerRating,
    publisher: book.publisher,
    releaseDate: book.releaseDate,
    series: book.series.map(s => s.id),
    title: book.title,
  }
}

export const BookEdit: FC<{ book: Book }> = ({ book }) => {
  const updateBook = useAudiobookState(s => s.updateBook)
  const form = useForm(bookToUpdate(book), {
    toForm: {
      releaseDate: value => value && toFormDate(value),
    },
  })

  return (
    <GenericEdit
      title="Edit Book"
      form={form}
      onSubmit={async (values, closeModal) => {
        await updateBook({ libraryId: book.library.id, id: book.id }, values)
        closeModal()
      }}
      InformationDisplay={() => <BookForm form={form} />}
      Search={({ onSelect }) => (
        <BookSearch
          libraryId={book.library.id}
          book={book.title}
          authors={book.authors.map(a => a.name)}
          onSelect={bookMeta => {
            form.setAllFields(mergeMetaIntoBook(form.fields, bookMeta))
            onSelect()
          }}
        />
      )}
    />
  )
}

const BookForm: FC<{ form: FormContext<BookUpdate> }> = ({ form }) => {
  const imageRef = useRef<HTMLInputElement>(null)
  return (
    <>
      <div className="flex flex-col md:flex-row">
        <div className="flex cursor-pointer items-center justify-center pr-2">
          <div className="flex flex-col justify-center">
            {form.fields.cover ? (
              <ResponsiveImage
                className="h-52 min-h-52 w-52 min-w-52 rounded-md"
                src={isUUID(form.fields.cover) ? `/api/stream/images/${form.fields.cover}` : form.fields.cover}
                alt="book"
                onClick={() => imageRef.current && imageRef.current.click()}
              />
            ) : (
              <CiImageOff
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
                form.setFields({ cover: base64 })
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
          <ManagedInput name="narrator" labelClassName="w-28" label="Narrator" leftIcon={<MdPerson />} />
          <ManagedInput name="language" labelClassName="w-28" label="Language" leftIcon={<MdLanguage />} />
          <ManagedInput
            name="releaseDate"
            labelClassName="w-28"
            type="date"
            label="Release Date"
            leftIcon={<MdEvent />}
          />
          <ManagedInput name="isbn" labelClassName="w-28" label="ISBN" leftIcon={<MdFormatListNumbered />} />
          <ManagedInput name="publisher" labelClassName="w-28" label="Publisher" leftIcon={<MdCollectionsBookmark />} />
        </div>
      </div>
      <label className="flex items-center">
        <HtmlEditor
          className="flex-grow"
          placeholder="Description"
          value={form.fields.description}
          onChange={description => form.setFields({ description: description ?? "" })}
        />
      </label>
    </>
  )
}

export default BookEdit
