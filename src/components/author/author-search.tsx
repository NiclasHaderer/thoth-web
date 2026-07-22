import { SearchIcon } from "lucide-react"
import { FC, Fragment, useState } from "react"
import { Api, MetadataAuthor, UUID } from "@thoth/client"
import { Input } from "@thoth/components/input/input"
import { LoadingCards } from "@thoth/components/loading-card"
import { ResponsiveImage } from "@thoth/components/responsive-image"
import { Button } from "@thoth/components/ui/button"
import { useHttpRequest } from "@thoth/hooks/async-response"

export const AuthorSearch: FC<{
  authorSearch?: string | null | undefined
  libraryId: UUID
  onSelect: (result: MetadataAuthor) => void
}> = ({ onSelect, authorSearch, libraryId }) => {
  const [author, setAuthor] = useState(authorSearch)

  const { result, loading, invoke } = useHttpRequest(Api.searchAuthorMetadata)

  const search = async () => {
    if (!author) return
    await invoke({ q: author, libraryId })
  }

  return (
    <>
      <div className="mb-4 flex items-center">
        <Input wrapperClassName="grow pr-2" label="Author" onEnter={search} onValue={setAuthor} defaultValue={author} />
        <Button variant="secondary" size="icon" className="ml-2 h-10 w-10" onPress={search}>
          <SearchIcon className="size-5" />
        </Button>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {result ? <AuthorSearchResult results={result} select={onSelect} /> : null}
        {loading ? <LoadingCards amount={10} /> : null}
      </div>
    </>
  )
}

const AuthorSearchResult: FC<{ results: MetadataAuthor[]; select: (result: MetadataAuthor) => void }> = ({
  results,
  select,
}) => {
  return (
    <>
      {results.length === 0 ? <div>Nothing was found</div> : null}
      {results.map((author, i) => (
        <Fragment key={i}>
          <div
            onClick={() => select(author)}
            className="hover:bg-muted focus:bg-muted flex cursor-pointer items-stretch justify-between rounded-md p-2 transition-colors"
            tabIndex={0}
          >
            <div>
              <h3 className="pr-2 pb-2 text-xl">{author.name || "Unknown"}</h3>
              <p className="line-clamp-4 pr-2">{author.biography}</p>
            </div>
            {author.imageURL ? (
              <ResponsiveImage
                className="h-28 w-28 min-w-28 rounded-full bg-cover"
                alt={author.name ?? "Cover"}
                src={author.imageURL}
              />
            ) : null}
          </div>
          {results.length - 1 !== i ? <hr className="border-border my-4" /> : null}
        </Fragment>
      ))}
    </>
  )
}
