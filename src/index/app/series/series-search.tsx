import React, { useState } from "react"
import { Input } from "../common/input"
import { ColoredButton } from "../common/colored-button"
import { MdSearch } from "react-icons/md"
import { MetadataSeries } from "../../models/metadata"
import { METADATA_CLIENT } from "../../api/metadata-client"
import { useHttpRequest } from "../../hooks/async-response"
import { LoadingCards } from "../common/loading-card"

export const SeriesSearch: React.VFC<{
  series?: string | null | undefined
  authors?: string[] | null | undefined
  select: (result: MetadataSeries) => void
}> = ({ series: _series, authors: _authors, select }) => {
  const [authors, setAuthors] = useState(_authors?.join(", "))
  const [series, setSeries] = useState(_series)

  const { result, loading, invoke } = useHttpRequest(METADATA_CLIENT.findSeries)

  const search = async () => {
    if (!series) return
    invoke({
      name: series,
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
          onValue={setAuthors}
          defaultValue={authors}
          onEnter={search}
        />
        <Input
          labelClassName="w-28"
          wrapperClassName="grow pr-2"
          label="Series"
          onValue={setSeries}
          defaultValue={series}
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
        {result ? <AuthorSearchResult results={result} select={select} /> : null}
        {loading ? <LoadingCards amount={10} /> : null}
      </div>
    </>
  )
}

const AuthorSearchResult: React.VFC<{ results: MetadataSeries[]; select: (result: MetadataSeries) => void }> = ({
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
            className="flex cursor-pointer items-center items-stretch justify-between rounded-md p-2 transition-colors hover:bg-active-light focus:bg-active-light"
            tabIndex={0}
          >
            <div>
              <h3 className="pb-2 pr-2 text-xl">{series.title || "Unknown"}</h3>
              <p className="pr-2 line-clamp-4">{series.description}</p>
            </div>
          </div>
          {results.length - 1 !== i ? <hr className="my-4 border-elevate" /> : null}
        </React.Fragment>
      ))}
    </>
  )
}
