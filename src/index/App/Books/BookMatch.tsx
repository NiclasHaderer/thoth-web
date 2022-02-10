import React, { useRef, useState } from "react"
import { Input } from "../Common/Input"
import { ColoredButton } from "../Common/ColoredButton"
import { MdSearch } from "react-icons/md"
import { BookMetadata } from "../../API/models/Metadat"
import { METADATA_CLIENT } from "../../API/MetadataClient"

export const BookSearch: React.VFC<{ author: string; book: string }> = ({ book, author }) => {
  const [searchResults, setSearchResults] = useState<BookMetadata[]>([])
  const authorInput = useRef<HTMLInputElement>()
  const bookInput = useRef<HTMLInputElement>()
  const search = async () => {
    if (!authorInput.current || !bookInput.current) return
    const response = await METADATA_CLIENT.findBook({
      bookName: bookInput.current.value,
      authorName: authorInput.current.value,
    })
    response && setSearchResults(response)
  }

  return (
    <>
      <div className="mb-4 flex items-center">
        <Input
          labelClassName="w-28"
          inputRef={authorInput}
          wrapperClassName="grow pr-2"
          label="Author"
          defaultValue={author}
        />
        <Input inputRef={bookInput} wrapperClassName="grow" label="Book" defaultValue={book} />
        <ColoredButton
          className="ml-2 h-10 w-10 min-w-10"
          innerClassName="!p-2 items-center justify-around"
          color="secondary"
          onClick={search}
        >
          <MdSearch className="h-5 w-5" />
        </ColoredButton>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {searchResults ? <BookSearchResult results={searchResults} /> : null}
      </div>
    </>
  )
}

const BookSearchResult: React.VFC<{ results: BookMetadata[] }> = ({ results }) => {
  return (
    <>
      {results.map((book, i) => (
        <>
          <div className="flex pr-2" key={i}>
            <div className="grow">
              <Input className="w-full" labelClassName="w-28" label="Book" defaultValue={book.title} />
              <Input className="w-full" labelClassName="w-28" label="Author" defaultValue={book.author?.name} />
              <Input className="w-full" labelClassName="w-28" label="Series" defaultValue={book.series?.name} />
              <Input className="w-full" labelClassName="w-28" label="Series Index" defaultValue={book.series?.index} />
              <Input className="w-full" labelClassName="w-28" label="Narrator" defaultValue={book.narrator} />
            </div>
            <ColoredButton className="my-2 ml-2 self-center">Apply</ColoredButton>
          </div>
          {results.length !== i ? <hr className="border-elevate" /> : null}
        </>
      ))}
    </>
  )
}
