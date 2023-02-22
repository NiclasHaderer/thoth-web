import React, { useCallback, useEffect } from "react"
import { MdImageNotSupported } from "react-icons/md"
import { useRoute } from "wouter"

import { AudiobookSelectors } from "../../state/audiobook.selectors"
import { useAudiobookState } from "../../state/audiobook.state"
import { isSeriesWithBooks } from "../../models/typeguards"
import { Book } from "../books/book"
import { ALink } from "../common/active-link"
import { HtmlViewer } from "../common/html-viewer"
import { ResponsiveGrid } from "../common/responsive-grid"
import SeriesEdit from "./series-edit"

export const SeriesDetails: React.VFC = () => {
  const [, id] = useRoute("/series/:id")
  const getSeriesWithBooks = useAudiobookState(AudiobookSelectors.fetchSeriesDetails)
  //eslint-disable-next-line react-hooks/exhaustive-deps
  const series = useAudiobookState(useCallback(AudiobookSelectors.selectSeries(id?.id), [id?.id]))

  useEffect(() => void getSeriesWithBooks(id?.id!), [id?.id, getSeriesWithBooks])
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
            {isSeriesWithBooks(series) && series.yearRange ? (
              <h3 className="pb-3 text-xl">
                {series.yearRange.start} - {series.yearRange.end}
              </h3>
            ) : null}
            <div>
              <div className="flex pb-3">
                <h3 className="min-w-40 pr-3 uppercase text-unimportant">Author</h3>
                {series.authors.map(author => (
                  <ALink href={`/authors/${author.id}`} key={author.id}>
                    <h3 className="text-xl hover:underline no-touch:group-focus:underline">{author.name}</h3>
                  </ALink>
                ))}
              </div>
              {isSeriesWithBooks(series) && series.narrators.length > 0 ? (
                <div className="flex pb-3">
                  <h3 className="min-w-40 pr-3 uppercase text-unimportant">Narrators</h3>
                  <div className="flex flex-wrap">
                    {series.narrators.map((narrator, i) => (
                      <h3 className="pr-2 text-xl" key={i}>
                        {narrator} {series.narrators.length === i + 1 ? null : ","}
                      </h3>
                    ))}
                  </div>
                </div>
              ) : null}
              {isSeriesWithBooks(series) ? (
                <div className="flex pb-3">
                  <h3 className="min-w-40 pr-3 uppercase text-unimportant">Book count</h3>
                  <h3 className="text-xl">{series.books.length}</h3>
                </div>
              ) : null}
              {series.totalBooks ? (
                <div className="flex pb-3">
                  <h3 className="min-w-40 pr-3 uppercase text-unimportant">Total works</h3>
                  <h3 className="text-xl">{series.totalBooks}</h3>
                </div>
              ) : null}
              {series.primaryWorks ? (
                <div className="flex pb-3">
                  <h3 className="min-w-40 pr-3 uppercase text-unimportant">Primary works</h3>
                  <h3 className="text-xl">{series.primaryWorks}</h3>
                </div>
              ) : null}
            </div>
          </div>
          <div className="mt-2">{isSeriesWithBooks(series) ? <SeriesEdit series={series} /> : null}</div>
        </div>
      </div>
      <HtmlViewer title="Description" content={series.description} className="min-w-full pb-6" />

      {isSeriesWithBooks(series) ? (
        <>
          <h2 className="p-2 pb-6 text-2xl">{series.books.length} Books</h2>
          <ResponsiveGrid>
            {series.books.map((book, k) => (
              <Book {...book} key={k} />
            ))}
          </ResponsiveGrid>
        </>
      ) : null}
    </>
  )
}

export default SeriesDetails
