import { SearchIcon } from "lucide-react"
import { FC, useState } from "react"
import { MetadataBook, UUID } from "@thoth/client"
import { MetadataResults } from "@thoth/components/generic/metadata-results"
import { Input } from "@thoth/components/input/input"
import { LoadingCards } from "@thoth/components/loading-card"
import { Button } from "@thoth/components/ui/button"
import { useBookMetadataSearch } from "@thoth/queries/metadata"

export const BookSearch: FC<{
  authors?: string[] | null | undefined
  book?: string | null | undefined
  libraryId: UUID
  onSelect: (result: MetadataBook) => void
}> = ({ book: _book, authors: _authors, libraryId, onSelect }) => {
  const [authors, setAuthors] = useState(_authors?.join(", "))
  const [book, setBook] = useState(_book)
  const [submitted, setSubmitted] = useState<{ q: string; authorName: string | undefined } | null>(null)

  const { data: result, isFetching: loading } = useBookMetadataSearch(libraryId, submitted)

  const search = () => {
    if (!book) return
    setSubmitted({ q: book, authorName: authors })
  }

  return (
    <>
      <div className="mb-4 flex items-center gap-2">
        <div className="grow">
          <Input
            labelClassName="w-28"
            label="Author"
            defaultValue={authors}
            onValue={setAuthors}
            onEnter={search}
            preventSubmit
            hideError
          />
        </div>
        <div className="grow">
          <Input label="Book" onValue={setBook} defaultValue={book} onEnter={search} preventSubmit hideError />
        </div>
        <Button variant="secondary" size="icon" aria-label="Search" onPress={search}>
          <SearchIcon />
        </Button>
      </div>
      <div className="h-0 min-h-48 grow overflow-y-auto">
        {result ? (
          <MetadataResults
            results={result}
            onSelect={onSelect}
            title={book => book.title}
            description={book => book.description}
            image={book =>
              book.coverURL ? <img className="h-28 w-28" alt={book.title ?? "Cover"} src={book.coverURL} /> : null
            }
          />
        ) : null}
        {loading ? <LoadingCards amount={10} /> : null}
      </div>
    </>
  )
}
