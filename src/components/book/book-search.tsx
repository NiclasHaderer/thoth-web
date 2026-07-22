import { SearchIcon } from "lucide-react"
import { FC, Fragment, useState } from "react"
import { Api, MetadataBook, UUID } from "@thoth/client"
import { Input } from "@thoth/components/input/input"
import { LoadingCards } from "@thoth/components/loading-card"
import { Button } from "@thoth/components/ui/button"
import { useHttpRequest } from "../../hooks/async-response"

export const BookSearch: FC<{
  authors?: string[] | null | undefined
  book?: string | null | undefined
  libraryId: UUID
  onSelect: (result: MetadataBook) => void
}> = ({ book: _book, authors: _authors, libraryId, onSelect }) => {
  const [authors, setAuthors] = useState(_authors?.join(", "))
  const [book, setBook] = useState(_book)

  const { result, loading, invoke } = useHttpRequest(Api.searchBookMetadata)

  const search = async () => {
    if (!book) return
    await invoke({ q: book, libraryId, authorName: authors })
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
        <Button variant="secondary" size="icon" className="ml-2 h-10 w-10" onPress={search}>
          <SearchIcon className="size-5" />
        </Button>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {result ? <BookSearchResult results={result} select={onSelect} /> : null}
        {loading ? <LoadingCards amount={10} /> : null}
      </div>
    </>
  )
}

const BookSearchResult: FC<{ results: MetadataBook[]; select: (result: MetadataBook) => void }> = ({
  results,
  select,
}) => {
  return (
    <>
      {results.length === 0 ? <div>Nothing was found</div> : null}
      {results.map((book, i) => (
        <Fragment key={i}>
          <div
            onClick={() => select(book)}
            className="hover:bg-muted focus:bg-muted flex cursor-pointer items-stretch justify-between rounded-md p-2 transition-colors"
            tabIndex={0}
          >
            <div>
              <h3 className="pr-2 pb-2 text-xl">{book.title || "Unknown"}</h3>
              <p className="line-clamp-4 pr-2">{book.description}</p>
            </div>
            {book.coverURL ? <img className="h-28 w-28" alt={book.title ?? "Cover"} src={book.coverURL} /> : null}
          </div>
          {results.length - 1 !== i ? <hr className="border-border my-4" /> : null}
        </Fragment>
      ))}
    </>
  )
}
