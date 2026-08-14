import {
  BookMarkedIcon,
  CalendarIcon,
  ListOrderedIcon,
  LanguagesIcon,
  UserIcon,
  SearchIcon,
  ImageOffIcon,
} from "lucide-react"
import { FC, useRef } from "react"
import { Book, BookUpdate, MetadataBook } from "@thoth/client"
import { GenericEdit } from "@thoth/components/generic/generic-edit.tsx"
import { ManagedInput } from "@thoth/components/input/managed-input"
import { ResponsiveImage } from "@thoth/components/responsive-image"
import { Button } from "@thoth/components/ui/button"
import { FormContext, useForm } from "../../hooks/form"
import { useAudiobookState } from "../../state/audiobook.state"
import { isUUID, toBase64, toFormDate } from "../../utils/utils"
import { HtmlEditor } from "../html-editor"
import { BookSearch } from "./book-search"

const mergeMetaIntoBook = ({ ...book }: BookUpdate, meta: MetadataBook): BookUpdate => {
  book.title = meta.title || book.title
  book.cover = meta.coverURL || book.cover
  book.description = meta.description || book.description
  book.narrators = meta.narrators.length > 0 ? meta.narrators : book.narrators
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
    narrators: book.narrators,
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
      narrators: value => value?.join(", "),
    },
    fromForm: {
      narrators: value =>
        value
          ?.split(",")
          .map(narrator => narrator.trim())
          .filter(Boolean) ?? [],
    },
  })

  return (
    <GenericEdit
      title="Edit Book"
      form={form}
      onSubmit={async (values, closeModal) => {
        await updateBook({ libraryId: book.libraryId, id: book.id }, values)
        closeModal()
      }}
      InformationDisplay={() => <BookForm form={form} />}
      Search={({ onSelect }) => (
        <BookSearch
          libraryId={book.libraryId}
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
              <ImageOffIcon
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
            <Button
              variant="secondary"
              className="mt-2 self-center"
              onPress={() => imageRef.current && imageRef.current.click()}
            >
              Upload image
            </Button>
          </div>
        </div>
        <div>
          <ManagedInput name="title" labelClassName="w-28" label="Title" leftIcon={<SearchIcon />} />
          <ManagedInput name="narrators" labelClassName="w-28" label="Narrators" leftIcon={<UserIcon />} />
          <ManagedInput name="language" labelClassName="w-28" label="Language" leftIcon={<LanguagesIcon />} />
          <ManagedInput
            name="releaseDate"
            labelClassName="w-28"
            type="date"
            label="Release Date"
            leftIcon={<CalendarIcon />}
          />
          <ManagedInput name="isbn" labelClassName="w-28" label="ISBN" leftIcon={<ListOrderedIcon />} />
          <ManagedInput name="publisher" labelClassName="w-28" label="Publisher" leftIcon={<BookMarkedIcon />} />
        </div>
      </div>
      <label className="flex items-center">
        <HtmlEditor
          className="grow"
          placeholder="Description"
          value={form.fields.description}
          onChange={description => form.setFields({ description: description ?? "" })}
        />
      </label>
    </>
  )
}

export default BookEdit
