import React, { FC, useEffect } from "react"
import { MdCheckCircle, MdImageNotSupported, MdPlayCircle, MdRadioButtonUnchecked } from "react-icons/md"

import { AudiobookSelectors } from "../../state/audiobook.selectors"
import { useAudiobookState } from "../../state/audiobook.state"
import { usePlaybackState } from "../../state/playback.state"
import { Track } from "../track/track"
import { BookEdit } from "./book-edit"
import Link from "next/link"
import { ColoredButton } from "@thoth/components/colored-button"
import { HtmlViewer } from "@thoth/components/html-editor/html-viewer"
import { isDetailedBook } from "@thoth/models/typeguards"
import { DetailedBookModel, UUID } from "@thoth/client"
import { BiDotsVerticalRounded } from "react-icons/bi"

export const BookDetails: FC<{ bookId: UUID }> = ({ bookId }) => {
  const getBookWithTracks = useAudiobookState(s => s.fetchBookDetails)
  const libraryId = useAudiobookState(AudiobookSelectors.selectedLibraryId)!
  const play = usePlaybackState(state => state.start)

  const book = useAudiobookState(AudiobookSelectors.selectBook(libraryId, bookId))

  useEffect(() => void getBookWithTracks({ libraryId, id: bookId }), [bookId, libraryId, getBookWithTracks])
  if (!book) return <></>

  const startPlayback = (position: number) => {
    const tracks = (book as DetailedBookModel).tracks

    const start = { ...tracks[position], authors: book.authors, coverID: book.coverID }
    const queue = tracks.slice(position + 1, tracks.length).map(q => ({
      ...q,
      authors: book.authors,
      coverID: book.coverID,
    }))
    const history = tracks.slice(0, position).map(q => ({ ...q, authors: book.authors, coverID: book.coverID }))

    play(start, queue, history)
  }

  return (
    <>
      <div className="flex pb-6">
        <div className="flex flex-col justify-around">
          {book.coverID ? (
            <img
              className="h-40 w-40 rounded-md border-2 border-active-light object-contain md:h-80 md:w-80"
              alt={book.title}
              src={`/api/stream/images/${book.coverID}`}
            />
          ) : (
            <MdImageNotSupported className="h-40 w-40 rounded-md border-2 border-active-light md:h-80 md:w-80" />
          )}
        </div>
        <div className="flex flex-grow flex-col justify-between pl-4 md:pl-10">
          <div>
            <h2 className="pb-3 text-2xl">{book.title}</h2>
            {book.releaseDate ? (
              <div className="flex pb-3">
                <h3 className="min-w-40 pr-3 uppercase text-font-secondary">Year</h3>
                <h3>{new Date(book.releaseDate).getFullYear()}</h3>
              </div>
            ) : null}
            <div className="flex pb-3">
              <h3 className="min-w-40 pr-3 uppercase text-font-secondary">Authors</h3>
              {book.authors.map(author => (
                <Link href={`/authors/${author.id}`} key={author.id}>
                  <h3 className="hover:underline focus:underline group-focus:underline">{author.name}</h3>
                </Link>
              ))}
            </div>
            {book.narrator ? (
              <div className="flex pb-3">
                <h3 className="min-w-40 pr-3 uppercase text-font-secondary">Narrator</h3>
                <h3>{book.narrator}</h3>
              </div>
            ) : null}
            {book.series ? (
              <div className="flex pb-3">
                <h3 className="min-w-40 pr-3 uppercase text-font-secondary">Series</h3>
                {book.series.map(series => (
                  <Link href={`/series/${series.id}`} key={series.id}>
                    <h3 className="hover:underline group-focus:underline">{series.title}</h3>
                  </Link>
                ))}
              </div>
            ) : null}
            {/*TODO fix this*/}
            {/*{book.seriesIndex ? (*/}
            {/*  <div className="flex pb-3">*/}
            {/*    <h3 className="min-w-40 pr-3 uppercase text-font-secondary">Series Index</h3>*/}
            {/*    <h3>{book.seriesIndex}</h3>*/}
            {/*  </div>*/}
            {/*) : null}*/}
            {book.language ? (
              <div className="flex pb-3">
                <h3 className="min-w-40 pr-3 uppercase text-font-secondary">Language</h3>
                <h3>{book.language}</h3>
              </div>
            ) : null}
          </div>
          <div className="mt-2">
            <ColoredButton className="mr-3" onClick={() => startPlayback(0)}>
              <MdPlayCircle className="mr-2" /> Play
            </ColoredButton>

            <ColoredButton color="secondary">
              <BiDotsVerticalRounded />
            </ColoredButton>

            <ColoredButton color="secondary" className="mr-3">
              <MdCheckCircle className="mr-2" />
              Done
              <MdRadioButtonUnchecked className="ml-2" />
            </ColoredButton>

            <BookEdit book={book} bookId={book.id} />
          </div>
        </div>
      </div>
      <HtmlViewer content={book.description} className="min-w-full pb-6" title="Description" />
      <div>
        {isDetailedBook(book) ? (
          <>
            <h3 className="p-2 pb-6 text-xl">{book.tracks.length} Tracks</h3>
            {book.tracks.map((track, k) => (
              <Track
                authors={book.authors}
                startPlayback={startPlayback}
                {...track}
                coverID={book?.coverID}
                key={k}
                index={k}
              />
            ))}
          </>
        ) : null}
      </div>
    </>
  )
}
export default BookDetails
