import React, { useCallback, useEffect } from "react"
import { MdImageNotSupported } from "react-icons/md"
import { useRoute } from "wouter"

import { AudiobookSelectors } from "../../State/Audiobook.Selectors"
import { useAudiobookState } from "../../State/Audiobook.State"
import { isSeriesWithBooks } from "../../State/Audiobook.Typeguards"
import { Book } from "../Books/Book"
import { ALink } from "../Common/ActiveLink"
import { HtmlViewer } from "../Common/HtmlViewer"
import { ResponsiveGrid } from "../Common/ResponsiveGrid"
import SeriesEdit from "./SeriesEdit"

export const SeriesDetails: React.VFC = () => {
  const [, id] = useRoute("/series/:id")
  const getSeriesWithBooks = useAudiobookState(AudiobookSelectors.fetchSeriesDetails)
  //eslint-disable-next-line react-hooks/exhaustive-deps
  const series = useAudiobookState(useCallback(AudiobookSelectors.selectSeries(id?.id), [id?.id]))

  useEffect(() => getSeriesWithBooks(id?.id!), [id?.id, getSeriesWithBooks])
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
                <ALink href={`/authors/${series.author.id}`}>
                  <h3 className="text-xl hover:underline no-touch:group-focus:underline">{series.author.name}</h3>
                </ALink>
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

              <div className="flex pb-3">
                <h3 className="min-w-40 pr-3 uppercase text-unimportant">Books</h3>
                <h3 className="text-xl">{series.amount}</h3>
              </div>
            </div>
          </div>
          <div className="mt-2">
            <SeriesEdit series={series} />
          </div>
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
