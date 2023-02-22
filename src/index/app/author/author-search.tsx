import React, { useState } from "react"
import { Input } from "../common/input"
import { ColoredButton } from "../common/colored-button"
import { MdSearch } from "react-icons/md"
import { MetadataAuthor } from "../../models/metadata"
import { METADATA_CLIENT } from "../../api/metadata-client"
import { useHttpRequest } from "../../hooks/async-response"
import { LoadingCards } from "../common/loading-card"
import { ResponsiveImage } from "../common/responsive-image"

export const AuthorSearch: React.VFC<{
  author?: string | null | undefined
  select: (result: MetadataAuthor) => void
}> = ({ select, author: _author }) => {
  const [author, setAuthor] = useState(_author)

  const { result, loading, invoke } = useHttpRequest(METADATA_CLIENT.findAuthor)

  const search = async () => {
    if (!author) return
    invoke({
      authorName: author,
    })
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

const AuthorSearchResult: React.VFC<{ results: MetadataAuthor[]; select: (result: MetadataAuthor) => void }> = ({
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
            className="flex cursor-pointer items-center items-stretch justify-between rounded-md p-2 transition-colors hover:bg-active-light focus:bg-active-light"
            tabIndex={0}
          >
            <div>
              <h3 className="pb-2 pr-2 text-xl">{author.name || "Unknown"}</h3>
              <p className="pr-2 line-clamp-4">{author.biography}</p>
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
