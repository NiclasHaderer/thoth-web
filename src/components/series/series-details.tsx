import React, { useEffect } from "react"
import { MdImageNotSupported } from "react-icons/md"

import { AudiobookSelectors } from "../../state/audiobook.selectors"
import { useAudiobookState } from "../../state/audiobook.state"
import SeriesEdit from "./series-edit"
import { UUID } from "@thoth/client"
import { isDetailedSeries } from "@thoth/models/typeguards"
import Link from "next/link"
import { HtmlViewer } from "@thoth/components/html-editor/html-viewer"
import { ResponsiveGrid } from "@thoth/components/responsive-grid"
import { BookDisplay } from "@thoth/components/book/book"

export const SeriesDetails: React.FC<{ seriesId: UUID }> = ({ seriesId }) => {
  const libraryId = useAudiobookState(AudiobookSelectors.selectedLibraryId)!
  const getSeriesWithBooks = useAudiobookState(s => s.fetchSeriesDetails)

  //eslint-disable-next-line react-hooks/exhaustive-deps
  const series = useAudiobookState(AudiobookSelectors.selectSeries(libraryId, seriesId))

  useEffect(() => void getSeriesWithBooks({ libraryId, id: seriesId }), [seriesId, libraryId, getSeriesWithBooks])
  if (!series) return <></>

  return (
    <>
      <div className="flex pb-6">
        <div className="flex flex-col justify-around">
          <MdImageNotSupported className="h-40 w-40 rounded-md border-2 border-active-light md:h-80 md:w-80" />
        </div>
        <div className="flex flex-grow flex-col justify-between pl-4 md:pl-10">
          <div>
            <h2 className="pb-3 text-2xl">{series.title}</h2>
            {isDetailedSeries(series) && series.yearRange ? (
              <h3 className="pb-3 text-xl">
                {series.yearRange.start} - {series.yearRange.end}
              </h3>
            ) : null}
            <div>
              <div className="flex pb-3">
                <h3 className="min-w-40 pr-3 uppercase text-font-secondary">Author</h3>
                {series.authors.map(author => (
                  <Link href={`/authors/${author.id}`} key={author.id}>
                    <h3 className="text-xl hover:underline no-touch:group-focus:underline">{author.name}</h3>
                  </Link>
                ))}
              </div>
              {isDetailedSeries(series) && series.narrators.length > 0 ? (
                <div className="flex pb-3">
                  <h3 className="min-w-40 pr-3 uppercase text-font-secondary">Narrators</h3>
                  <div className="flex flex-wrap">
                    {series.narrators.map((narrator, i) => (
                      <h3 className="pr-2 text-xl" key={i}>
                        {narrator} {series.narrators.length === i + 1 ? null : ","}
                      </h3>
                    ))}
                  </div>
                </div>
              ) : null}
              {isDetailedSeries(series) ? (
                <div className="flex pb-3">
                  <h3 className="min-w-40 pr-3 uppercase text-font-secondary">Book count</h3>
                  <h3 className="text-xl">{series.books.length}</h3>
                </div>
              ) : null}
              {series.totalBooks ? (
                <div className="flex pb-3">
                  <h3 className="min-w-40 pr-3 uppercase text-font-secondary">Total works</h3>
                  <h3 className="text-xl">{series.totalBooks}</h3>
                </div>
              ) : null}
              {series.primaryWorks ? (
                <div className="flex pb-3">
                  <h3 className="min-w-40 pr-3 uppercase text-font-secondary">Primary works</h3>
                  <h3 className="text-xl">{series.primaryWorks}</h3>
                </div>
              ) : null}
            </div>
          </div>
          <div className="mt-2">
            {isDetailedSeries(series) ? <SeriesEdit series={series} seriesId={series.id} /> : null}
          </div>
        </div>
      </div>
      <HtmlViewer title="Description" content={series.description} className="min-w-full pb-6" />

      {isDetailedSeries(series) ? (
        <>
          <h2 className="p-2 pb-6 text-2xl">{series.books.length} Books</h2>
          <ResponsiveGrid>
            {series.books.map((book, k) => (
              <BookDisplay {...book} key={k} />
            ))}
          </ResponsiveGrid>
        </>
      ) : null}
    </>
  )
}

export default SeriesDetails
