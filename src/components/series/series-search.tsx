import { FC, Fragment, useState } from "react"
import { MdSearch } from "react-icons/md"
import { Api, MetadataSeries, UUID } from "@thoth/client"
import { Input } from "@thoth/components/input/input"
import { LoadingCards } from "@thoth/components/loading-card"
import { Button } from "@thoth/components/ui/button"
import { useHttpRequest } from "../../hooks/async-response"

export const SeriesSearch: FC<{
  series?: string | null | undefined
  authors?: string[] | null | undefined
  libraryId: UUID
  onSelect: (result: MetadataSeries) => void
}> = ({ series: _series, authors: _authors, libraryId, onSelect }) => {
  const [authors, setAuthors] = useState(_authors?.join(", "))
  const [series, setSeries] = useState(_series)

  const { result, loading, invoke } = useHttpRequest(Api.searchSeriesMetadata)

  const search = async () => {
    if (!series) return
    await invoke({ q: series, libraryId, authorName: authors })
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
        <Button variant="secondary" size="icon" className="ml-2 h-10 w-10" onPress={search}>
          <MdSearch className="size-5" />
        </Button>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {result ? <AuthorSearchResult results={result} select={onSelect} /> : null}
        {loading ? <LoadingCards amount={10} /> : null}
      </div>
    </>
  )
}

const AuthorSearchResult: FC<{ results: MetadataSeries[]; select: (result: MetadataSeries) => void }> = ({
  results,
  select,
}) => {
  return (
    <>
      {results.length === 0 ? <div>Nothing was found</div> : null}
      {results.map((series, i) => (
        <Fragment key={i}>
          <div
            onClick={() => select(series)}
            className="hover:bg-muted focus:bg-muted flex cursor-pointer items-stretch justify-between rounded-md p-2 transition-colors"
            tabIndex={0}
          >
            <div>
              <h3 className="pr-2 pb-2 text-xl">{series.title || "Unknown"}</h3>
              <p className="line-clamp-4 pr-2">{series.description}</p>
            </div>
          </div>
          {results.length - 1 !== i ? <hr className="border-border my-4" /> : null}
        </Fragment>
      ))}
    </>
  )
}
