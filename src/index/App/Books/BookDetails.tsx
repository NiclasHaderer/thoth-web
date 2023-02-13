import React, { useCallback, useEffect } from "react"
import { MdCheckCircle, MdImageNotSupported, MdPlayCircle, MdRadioButtonUnchecked } from "react-icons/md"
import { useRoute } from "wouter"

import { BookModelWithTracks } from "../../API/models/Api"
import { environment } from "../../env"
import { AudiobookSelectors } from "../../State/Audiobook.Selectors"
import { useAudiobookState } from "../../State/Audiobook.State"
import { isBookWithTracks } from "../../State/Audiobook.Typeguards"
import { usePlaybackState } from "../../State/Playback"
import { ALink } from "../Common/ActiveLink"
import { ColoredButton } from "../Common/ColoredButton"
import { HtmlViewer } from "../Common/HtmlViewer"
import { Track } from "../Track/Track"
import { BookEdit } from "./BookEdit"

export const BookDetails = () => {
  const [, id] = useRoute("/books/:id")
  const getBookWithTracks = useAudiobookState(s => s.fetchBooksDetails)
  const play = usePlaybackState(state => state.start)

  //eslint-disable-next-line react-hooks/exhaustive-deps
  const book = useAudiobookState(useCallback(AudiobookSelectors.selectBook(id?.id), [id?.id]))

  useEffect(() => getBookWithTracks(id?.id!), [id?.id, getBookWithTracks])
  if (!book) return <></>

  const startPlayback = (position: number) => {
    const tracks = (book as BookModelWithTracks).tracks

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
              src={`${environment.apiURL}/image/${book.coverID}`}
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
                <h3 className="min-w-40 pr-3 uppercase text-unimportant">Year</h3>
                <h3>{new Date(book.releaseDate).getFullYear()}</h3>
              </div>
            ) : null}
            <div className="flex pb-3">
              <h3 className="min-w-40 pr-3 uppercase text-unimportant">Author</h3>
              {book.authors.map(author => (
                <ALink href={`/authors/${author.id}`} key={author.id}>
                  <h3 className="hover:underline  focus:underline group-focus:underline">{author.name}</h3>
                </ALink>
              ))}
            </div>
            {book.narrator ? (
              <div className="flex pb-3">
                <h3 className="min-w-40 pr-3 uppercase text-unimportant">Narrator</h3>
                <h3>{book.narrator}</h3>
              </div>
            ) : null}
            {book.series ? (
              <div className="flex pb-3">
                <h3 className="min-w-40 pr-3 uppercase text-unimportant">Series</h3>
                {book.series.map(series => (
                  <ALink href={`/series/${series.id}`} key={series.id}>
                    <h3 className="hover:underline group-focus:underline">{series.title}</h3>
                  </ALink>
                ))}
              </div>
            ) : null}
            {/*TODO fix this*/}
            {/*{book.seriesIndex ? (*/}
            {/*  <div className="flex pb-3">*/}
            {/*    <h3 className="min-w-40 pr-3 uppercase text-unimportant">Series Index</h3>*/}
            {/*    <h3>{book.seriesIndex}</h3>*/}
            {/*  </div>*/}
            {/*) : null}*/}
            {book.language ? (
              <div className="flex pb-3">
                <h3 className="min-w-40 pr-3 uppercase text-unimportant">Language</h3>
                <h3>{book.language}</h3>
              </div>
            ) : null}
          </div>
          <div className="mt-2">
            <ColoredButton className="mr-3" onClick={() => startPlayback(0)}>
              <MdPlayCircle className="mr-2" /> Play
            </ColoredButton>

            <ColoredButton color="secondary" className="mr-3">
              <MdCheckCircle className="mr-2" />
              Done
              <MdRadioButtonUnchecked className="ml-2" />
            </ColoredButton>

            <BookEdit book={book} />
          </div>
        </div>
      </div>
      <HtmlViewer content={book.description} className="min-w-full pb-6" title="Description" />
      <div>
        <h3 className="p-2 pb-6 text-xl">{isBookWithTracks(book) ? book.tracks.length : ""} Tracks</h3>
        {(isBookWithTracks(book) ? book.tracks : []).map((track, k) => (
          <Track
            authors={book.authors}
            startPlayback={startPlayback}
            {...track}
            coverID={book?.coverID}
            key={k}
            index={k}
          />
        ))}
      </div>
    </>
  )
}
export default BookDetails
