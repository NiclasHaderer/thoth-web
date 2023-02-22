import React, { memo, useState } from "react"
import { Input } from "../common/input"
import { ColoredButton } from "../common/colored-button"
import { MdSearch } from "react-icons/md"
import { MetadataBook } from "../../models/metadata"
import { METADATA_CLIENT } from "../../api/metadata-client"
import { useHttpRequest } from "../../hooks/async-response"
import { LoadingCards } from "../common/loading-card"

export const BookSearch: React.VFC<{
  authors?: string[] | null | undefined
  book?: string | null | undefined
  select: (result: MetadataBook) => void
}> = memo(({ book: _book, authors: _authors, select }) => {
  const [authors, setAuthors] = useState(_authors?.join(", "))
  const [book, setBook] = useState(_book)

  const { result, loading, invoke } = useHttpRequest(METADATA_CLIENT.findBook)

  const search = () => {
    if (!book) return
    invoke({
      bookName: book,
      authorName: authors,
    })
  }

  return (
    <>
      <div className="mb-4 flex items-center">
        <Input
          labelClassName="w-28"
          wrapperClassName="grow pr-2"
          label="Author"
          defaultValue={authors}
          onValue={setAuthors}
          onEnter={search}
        />

        <Input wrapperClassName="grow" label="Book" onValue={setBook} defaultValue={book} onEnter={search} />
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

const BookSearchResult: React.VFC<{ results: MetadataBook[]; select: (result: MetadataBook) => void }> = ({
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
            className="flex cursor-pointer items-center items-stretch justify-between rounded-md p-2 transition-colors hover:bg-active-light focus:bg-active-light"
            tabIndex={0}
          >
            <div>
              <h3 className="pb-2 pr-2 text-xl">{book.title || "Unknown"}</h3>
              <p className="pr-2 line-clamp-4">{book.description}</p>
            </div>
            {book.coverURL ? <img className="h-28 w-28" alt={book.title ?? "Cover"} src={book.coverURL} /> : null}
          </div>
          {results.length - 1 !== i ? <hr className="my-4 border-elevate" /> : null}
        </React.Fragment>
      ))}
    </>
  )
}
