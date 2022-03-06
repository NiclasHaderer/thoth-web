import React, { memo, useRef, useState } from "react"
import { Input } from "../Common/Input"
import { ColoredButton } from "../Common/ColoredButton"
import { MdSearch } from "react-icons/md"
import { BookMetadata } from "../../API/models/Metadat"
import { METADATA_CLIENT } from "../../API/MetadataClient"
import { useHttpRequest } from "../../Hooks/AsyncResponse"
import { LoadingCards } from "../Common/LoadingCard"

export const BookSearch: React.VFC<{
  author?: string | null | undefined
  book: string
  select: (result: BookMetadata) => void
}> = memo(({ book: _book, author: _author, select }) => {
  const [author, setAuthor] = useState(_author)
  const [book, setBook] = useState(_book)

  const authorInput = useRef<HTMLInputElement>()
  const bookInput = useRef<HTMLInputElement>()
  const { result, loading, invoke } = useHttpRequest(METADATA_CLIENT.findBook)

  const search = async () => {
    if (!authorInput.current || !bookInput.current) return
    invoke({
      bookName: bookInput.current.value,
      authorName: authorInput.current.value,
    })
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
          onValue={setAuthor}
          onEnter={search}
        />
        <Input
          inputRef={bookInput}
          wrapperClassName="grow"
          label="Book"
          onValue={setBook}
          defaultValue={book}
          onEnter={search}
        />
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
        {result ? <BookSearchResult results={result} select={select} /> : null}
        {loading ? <LoadingCards amount={10} /> : null}
      </div>
    </>
  )
})

const BookSearchResult: React.VFC<{ results: BookMetadata[]; select: (result: BookMetadata) => void }> = ({
  results,
  select,
}) => {
  return (
    <>
      {results.length === 0 ? <div>Nothing was found</div> : null}
      {results.map((book, i) => (
        <React.Fragment key={i}>
          <div
            onClick={() => select(book)}
            className="flex cursor-pointer items-center rounded-md p-2 transition-colors hover:bg-active-light focus:bg-active-light"
            tabIndex={0}
          >
            <div>
              <h3 className="pb-2 pr-2 text-xl">{book.title || "Unknown"}</h3>
              <p className="pr-2 line-clamp-4">{book.description}</p>
            </div>
            {book.image ? <img className="h-28 w-28" alt={book.title ?? "Cover"} src={book.image} /> : null}
          </div>
          {results.length - 1 !== i ? <hr className="my-4 border-elevate" /> : null}
        </React.Fragment>
      ))}
    </>
  )
}
