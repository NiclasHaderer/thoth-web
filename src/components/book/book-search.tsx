import React, { memo, useState } from "react"
import { MdSearch } from "react-icons/md"
import { useHttpRequest } from "../../hooks/async-response"
import { MetadataBook } from "@thoth/client"
import { Api } from "@thoth/client"
import { Input } from "@thoth/components/input/input"
import { ColoredButton } from "@thoth/components/colored-button"
import { LoadingCards } from "@thoth/components/loading-card"
import { useAudiobookState } from "@thoth/state/audiobook.state"
import { AudiobookSelectors } from "@thoth/state/audiobook.selectors"

export const BookSearch: React.FC<{
  authors?: string[] | null | undefined
  book?: string | null | undefined
  select: (result: MetadataBook) => void
}> = ({ book: _book, authors: _authors, select }) => {
  const [authors, setAuthors] = useState(_authors?.join(", "))
  const [book, setBook] = useState(_book)
  const library = useAudiobookState(AudiobookSelectors.selectedLibrary)

  const { result, loading, invoke } = useHttpRequest(Api.searchBookMetadata)

  const search = () => {
    if (!book) return
    invoke(book, library.language, authors)
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
}

const BookSearchResult: React.FC<{ results: MetadataBook[]; select: (result: MetadataBook) => void }> = ({
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
            className="flex cursor-pointer items-stretch justify-between rounded-md p-2 transition-colors hover:bg-active-light focus:bg-active-light"
            tabIndex={0}
          >
            <div>
              <h3 className="pb-2 pr-2 text-xl">{book.title || "Unknown"}</h3>
              <p className="line-clamp-4 pr-2">{book.description}</p>
            </div>
            {book.coverURL ? <img className="h-28 w-28" alt={book.title ?? "Cover"} src={book.coverURL} /> : null}
          </div>
          {results.length - 1 !== i ? <hr className="my-4 border-elevate" /> : null}
        </React.Fragment>
      ))}
    </>
  )
}
