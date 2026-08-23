import { useQuery } from "@tanstack/react-query"
import { SearchIcon } from "lucide-react"
import { FC, useState } from "react"
import { Api, MetadataSeries, UUID, unwrap } from "@thoth/client"
import { MetadataResults } from "@thoth/components/generic/metadata-results"
import { Input } from "@thoth/components/input/input"
import { LoadingCards } from "@thoth/components/loading-card"
import { Button } from "@thoth/components/ui/button"
import { queryKeys } from "@thoth/queries/keys"

export const SeriesSearch: FC<{
  series?: string | null | undefined
  authors?: string[] | null | undefined
  libraryId: UUID
  onSelect: (result: MetadataSeries) => void
}> = ({ series: _series, authors: _authors, libraryId, onSelect }) => {
  const [authors, setAuthors] = useState(_authors?.join(", "))
  const [series, setSeries] = useState(_series)
  const [submitted, setSubmitted] = useState<{ q: string; authorName: string | undefined } | null>(null)

  const { data: result, isFetching: loading } = useQuery({
    queryKey: queryKeys.metadataSearch("series", libraryId, submitted ?? {}),
    queryFn: () => unwrap(Api.searchSeriesMetadata({ q: submitted!.q, libraryId, authorName: submitted!.authorName })),
    meta: { action: "search for series metadata" },
    enabled: submitted !== null,
  })

  const search = () => {
    if (!series) return
    setSubmitted({ q: series, authorName: authors })
  }

  return (
    <>
      <div className="mb-4 flex items-center gap-2">
        <div className="grow">
          <Input
            labelClassName="w-28"
            label="Series"
            onValue={setSeries}
            defaultValue={series}
            onEnter={search}
            preventSubmit
            hideError
          />
        </div>
        <div className="grow">
          <Input label="Author" onValue={setAuthors} defaultValue={authors} onEnter={search} preventSubmit hideError />
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
            title={series => series.title}
            description={series => series.description}
          />
        ) : null}
        {loading ? <LoadingCards amount={10} /> : null}
      </div>
    </>
  )
}
