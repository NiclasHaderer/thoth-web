import { SearchIcon } from "lucide-react"
import { FC, useState } from "react"
import { MetadataAuthor, UUID } from "@thoth/client"
import { MetadataResults } from "@thoth/components/generic/metadata-results"
import { Input } from "@thoth/components/input/input"
import { LoadingCards } from "@thoth/components/loading-card"
import { ResponsiveImage } from "@thoth/components/responsive-image"
import { Button } from "@thoth/components/ui/button"
import { useAuthorMetadataSearch } from "@thoth/queries/metadata"

export const AuthorSearch: FC<{
  authorSearch?: string | null | undefined
  libraryId: UUID
  onSelect: (result: MetadataAuthor) => void
}> = ({ onSelect, authorSearch, libraryId }) => {
  const [author, setAuthor] = useState(authorSearch)
  const [submitted, setSubmitted] = useState<{ q: string } | null>(null)

  const { data: result, isFetching: loading } = useAuthorMetadataSearch(libraryId, submitted)

  const search = () => {
    if (!author) return
    setSubmitted({ q: author })
  }

  return (
    <>
      <div className="mb-4 flex items-center gap-2">
        <div className="grow">
          <Input label="Author" onEnter={search} onValue={setAuthor} defaultValue={author} preventSubmit hideError />
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
            title={author => author.name}
            description={author => author.biography}
            image={author =>
              author.imageURL ? (
                <ResponsiveImage
                  className="h-28 w-28 min-w-28 rounded-full bg-cover"
                  alt={author.name ?? "Cover"}
                  src={author.imageURL}
                />
              ) : null
            }
          />
        ) : null}
        {loading ? <LoadingCards amount={10} /> : null}
      </div>
    </>
  )
}
