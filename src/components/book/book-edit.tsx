import { fromFormDate, isUUID, toBase64, toFormDate } from "@/utils/utils.ts"
import {
  BookMarkedIcon,
  CalendarIcon,
  LayersIcon,
  ListOrderedIcon,
  LanguagesIcon,
  TagsIcon,
  UserIcon,
  UsersIcon,
  SearchIcon,
  ImageOffIcon,
  PencilIcon,
} from "lucide-react"
import { FC, useRef } from "react"
import { Book, BookUpdate, MetadataBook, UUID } from "@thoth/client"
import { GenericEdit } from "@thoth/components/generic/generic-edit.tsx"
import { ManagedInput } from "@thoth/components/input/managed-input"
import { MultiCombobox } from "@thoth/components/input/multi-combobox"
import { ResponsiveImage } from "@thoth/components/responsive-image"
import { Button } from "@thoth/components/ui/button"
import {
  useAllAuthors,
  useAllGenres,
  useAllSeries,
  useCreateAuthor,
  useCreateSeries,
  useUpdateBook,
} from "@thoth/queries/resources"
import { FormContext, useForm } from "../../hooks/form"
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
    genres: book.genres,
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
  const updateBook = useUpdateBook()
  const form = useForm(bookToUpdate(book), {
    toForm: {
      releaseDate: value => value && toFormDate(value),
      narrators: value => value?.join(", "),
    },
    fromForm: {
      releaseDate: value => fromFormDate(value) as unknown as string,
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
      trigger={open => (
        <Button
          variant="ghost"
          size="icon-lg"
          aria-label="Edit book"
          onPress={open}
          className="text-muted-foreground hover:text-foreground size-11 rounded-full sm:size-10"
        >
          <PencilIcon className="size-5" />
        </Button>
      )}
      onSubmit={async (values, closeModal) => {
        await updateBook.mutateAsync({ libraryId: book.libraryId, id: book.id, data: values })
        closeModal()
      }}
      information={<BookForm form={form} libraryId={book.libraryId} />}
      search={onSelect => (
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

const BookForm: FC<{ form: FormContext<BookUpdate>; libraryId: UUID }> = ({ form, libraryId }) => {
  const imageRef = useRef<HTMLInputElement>(null)
  const { data: authors } = useAllAuthors(libraryId)
  const { data: series } = useAllSeries(libraryId)
  const { data: genres } = useAllGenres(libraryId)
  const createAuthor = useCreateAuthor()
  const createSeries = useCreateSeries()
  return (
    <>
      <div className="flex flex-col md:flex-row">
        <div className="flex cursor-pointer items-center justify-center pr-2">
          <div className="flex flex-col justify-center">
            {form.fields.cover ? (
              <ResponsiveImage
                className="h-52 min-h-52 w-52 min-w-52 rounded-md lg:h-72 lg:min-h-72 lg:w-72 lg:min-w-72"
                src={isUUID(form.fields.cover) ? `/api/stream/images/${form.fields.cover}` : form.fields.cover}
                alt="book"
                onClick={() => imageRef.current && imageRef.current.click()}
              />
            ) : (
              <ImageOffIcon
                className="h-52 w-52 cursor-pointer rounded-md lg:h-72 lg:w-72"
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
        <div className="min-w-0 grow">
          <ManagedInput name="title" labelClassName="w-28" label="Title" leftIcon={<SearchIcon />} />
          <MultiCombobox
            label="Authors"
            labelClassName="w-28"
            leftIcon={<UsersIcon />}
            options={(authors ?? []).map(author => ({ id: author.id, label: author.name }))}
            value={form.fields.authors ?? []}
            onChange={authors => form.setFields({ authors })}
            onCreate={async name => (await createAuthor.mutateAsync({ libraryId, data: { name } })).id}
          />
          <MultiCombobox
            label="Series"
            labelClassName="w-28"
            leftIcon={<LayersIcon />}
            options={(series ?? []).map(entry => ({ id: entry.id, label: entry.title }))}
            value={form.fields.series ?? []}
            onChange={series => form.setFields({ series })}
            onCreate={async title => (await createSeries.mutateAsync({ libraryId, data: { title } })).id}
          />
          <ManagedInput name="narrators" labelClassName="w-28" label="Narrators" leftIcon={<UserIcon />} />
          <MultiCombobox
            label="Genres"
            labelClassName="w-28"
            leftIcon={<TagsIcon />}
            options={[...new Set([...(genres ?? []).map(genre => genre.name), ...(form.fields.genres ?? [])])].map(
              genre => ({ id: genre, label: genre })
            )}
            value={form.fields.genres ?? []}
            onChange={genres => form.setFields({ genres })}
            onCreate={genre => Promise.resolve(genre)}
          />
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
