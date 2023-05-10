import React, { FC, useState } from "react"
import { MdSearch } from "react-icons/md"
import { Api, MetadataAuthor } from "@thoth/client"
import { useHttpRequest } from "@thoth/hooks/async-response"
import { Input } from "@thoth/components/input/input"
import { ColoredButton } from "@thoth/components/colored-button"
import { LoadingCards } from "@thoth/components/loading-card"
import { ResponsiveImage } from "@thoth/components/responsive-image"
import { AudiobookSelectors } from "@thoth/state/audiobook.selectors"
import { useAudiobookState } from "@thoth/state/audiobook.state"

export const AuthorSearch: FC<{
  author?: string | null | undefined
  select: (result: MetadataAuthor) => void
}> = ({ select, author: _author }) => {
  const [author, setAuthor] = useState(_author)

  const library = useAudiobookState(AudiobookSelectors.selectedLibrary)!
  const { result, loading, invoke } = useHttpRequest(Api.searchAuthorMetadata)

  const search = async () => {
    if (!author) return
    invoke({ q: author, region: library.language })
  }

  return (
    <>
      <div className="mb-4 flex items-center">
        <Input
          labelClassName="w-28"
          wrapperClassName="grow pr-2"
          label="Author"
          onEnter={search}
          onValue={setAuthor}
          defaultValue={author}
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
        {result ? <AuthorSearchResult results={result} select={select} /> : null}
        {loading ? <LoadingCards amount={10} /> : null}
      </div>
    </>
  )
}

const AuthorSearchResult: React.FC<{ results: MetadataAuthor[]; select: (result: MetadataAuthor) => void }> = ({
  results,
  select,
}) => {
  return (
    <>
      {results.length === 0 ? <div>Nothing was found</div> : null}
      {results.map((author, i) => (
        <React.Fragment key={i}>
          <div
            onClick={() => select(author)}
            className="flex cursor-pointer items-stretch justify-between rounded-md p-2 transition-colors hover:bg-active-light focus:bg-active-light"
            tabIndex={0}
          >
            <div>
              <h3 className="pb-2 pr-2 text-xl">{author.name || "Unknown"}</h3>
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
          {results.length - 1 !== i ? <hr className="my-4 border-elevate" /> : null}
        </React.Fragment>
      ))}
    </>
  )
}
