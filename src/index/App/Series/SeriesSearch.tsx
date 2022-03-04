import React, { useRef } from "react"
import { Input } from "../Common/Input"
import { ColoredButton } from "../Common/ColoredButton"
import { MdSearch } from "react-icons/md"
import { SeriesMetadata } from "../../API/models/Metadat"
import { METADATA_CLIENT } from "../../API/MetadataClient"
import { useHttpRequest } from "../../Hooks/AsyncResponse"
import { LoadingCards } from "../Common/LoadingCard"

export const SeriesSearch: React.VFC<{
  series: string
  author?: string | null | undefined
  select: (result: SeriesMetadata) => void
}> = ({ series, author, select }) => {
  const seriesInput = useRef<HTMLInputElement>()
  const authorInput = useRef<HTMLInputElement>()
  const { result, loading, invoke } = useHttpRequest(METADATA_CLIENT.findSeries)

  const search = async () => {
    if (!seriesInput.current) return
    invoke({
      name: seriesInput.current.value,
    })
  }

  return (
    <>
      <div className="mb-4 flex items-center">
        <Input
          labelClassName="w-28"
          inputRef={seriesInput}
          wrapperClassName="grow pr-2"
          label="Series"
          defaultValue={series}
        />
        <Input
          labelClassName="w-28"
          inputRef={authorInput}
          wrapperClassName="grow pr-2"
          label="Author"
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

const AuthorSearchResult: React.VFC<{ results: SeriesMetadata[]; select: (result: SeriesMetadata) => void }> = ({
  results,
  select,
}) => {
  return (
    <>
      {results.length === 0 ? <div>Nothing was found</div> : null}
      {results.map((series, i) => (
        <React.Fragment key={i}>
          <div
            onClick={() => select(series)}
            className="flex cursor-pointer items-center rounded-md p-2 transition-colors hover:bg-light-active focus:bg-light-active"
            tabIndex={0}
          >
            <div>
              <h3 className="pb-2 pr-2 text-xl">{series.name || "Unknown"}</h3>
              <p className="pr-2 line-clamp-4">{series.description}</p>
            </div>
          </div>
          {results.length - 1 !== i ? <hr className="my-4 border-elevate" /> : null}
        </React.Fragment>
      ))}
    </>
  )
}
