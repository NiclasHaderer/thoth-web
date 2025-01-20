import React, { useState } from "react"
import { MdSearch } from "react-icons/md"
import { useHttpRequest } from "../../hooks/async-response"
import { MetadataSeries } from "@thoth/client"
import { Api } from "@thoth/client"
import { Input } from "@thoth/components/input/input"
import { ColoredButton } from "@thoth/components/colored-button"
import { LoadingCards } from "@thoth/components/loading-card"
import { useAudiobookState } from "@thoth/state/audiobook.state"
import { AudiobookSelectors } from "@thoth/state/audiobook.selectors"

export const SeriesSearch: React.FC<{
  series?: string | null | undefined
  authors?: string[] | null | undefined
  select: (result: MetadataSeries) => void
}> = ({ series: _series, authors: _authors, select }) => {
  const [authors, setAuthors] = useState(_authors?.join(", "))
  const [series, setSeries] = useState(_series)
  const library = useAudiobookState(AudiobookSelectors.selectedLibrary)!

  const { result, loading, invoke } = useHttpRequest(Api.searchSeriesMetadata)

  const search = async () => {
    if (!series) return
    await invoke({ q: series, region: library.language, authorName: authors })
  }

  return (
    <>
      <div className="mb-4 flex items-center">
        <Input
          labelClassName="w-28"
          wrapperClassName="grow pr-2"
          label="Series"
          onValue={setSeries}
          defaultValue={series}
          onEnter={search}
        />
        <Input
          labelClassName="w-28"
          wrapperClassName="grow pr-2"
          label="Author"
          onValue={setAuthors}
          defaultValue={authors}
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

const AuthorSearchResult: React.FC<{ results: MetadataSeries[]; select: (result: MetadataSeries) => void }> = ({
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
            className="flex cursor-pointer items-stretch justify-between rounded-md p-2 transition-colors hover:bg-active-light focus:bg-active-light"
            tabIndex={0}
          >
            <div>
              <h3 className="pb-2 pr-2 text-xl">{series.title || "Unknown"}</h3>
              <p className="line-clamp-4 pr-2">{series.description}</p>
            </div>
          </div>
          {results.length - 1 !== i ? <hr className="my-4 border-elevate" /> : null}
        </React.Fragment>
      ))}
    </>
  )
}
