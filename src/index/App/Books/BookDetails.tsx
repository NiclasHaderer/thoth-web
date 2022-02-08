import React, { useCallback, useEffect } from "react"
import { MdImageNotSupported, MdPlayCircle } from "react-icons/md"
import { useRoute } from "wouter"

import { BookModelWithTracks } from "../../API/Audiobook"
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

    const start = { ...tracks[position], author: book.author, cover: book.cover }
    const queue = tracks.slice(position + 1, tracks.length).map(q => ({ ...q, author: book.author, cover: book.cover }))
    const history = tracks.slice(0, position).map(q => ({ ...q, author: book.author, cover: book.cover }))

    play(start, queue, history)
  }

  return (
    <>
      <div className="flex pb-6">
        <div className="flex flex-col justify-around">
          {book.cover ? (
            <img
              className="h-40 w-40 rounded-md border-2 border-light-active object-contain md:h-80 md:w-80"
              alt={book.title}
              src={`${environment.apiURL}/image/${book.cover}`}
            />
          ) : (
            <MdImageNotSupported className="h-40 w-40 rounded-md border-2 border-light-active md:h-80 md:w-80" />
          )}
        </div>
        <div className="flex flex-grow flex-col justify-between pl-4 md:pl-10">
          <div>
            <h2 className="pb-3 text-2xl">{book.title}</h2>
            {book.year ? (
              <div className="flex pb-3">
                <h3 className="min-w-40 pr-3 uppercase text-unimportant">Year</h3>
                <h3>{book.year}</h3>
              </div>
            ) : null}
            <div className="flex pb-3">
              <h3 className="min-w-40 pr-3 uppercase text-unimportant">Author</h3>
              <ALink href={`/authors/${book.author.id}`}>
                <h3 className="hover:underline  focus:underline group-focus:underline">{book.author.name}</h3>
              </ALink>
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
                <ALink href={`/series/${book.series.id}`}>
                  <h3 className="hover:underline group-focus:underline">{book.series.title}</h3>
                </ALink>
              </div>
            ) : null}
            {book.seriesIndex ? (
              <div className="flex pb-3">
                <h3 className="min-w-40 pr-3 uppercase text-unimportant">Series Index</h3>
                <h3>{book.seriesIndex}</h3>
              </div>
            ) : null}
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
            <BookEdit book={book} />
          </div>
        </div>
      </div>
      <HtmlViewer content={book.description} className="min-w-full pb-6" title="Description" />
      <div>
        <h3 className="p-2 pb-6 text-xl">{isBookWithTracks(book) ? book.tracks.length : ""} Tracks</h3>
        {(isBookWithTracks(book) ? book.tracks : []).map((track, k) => (
          <Track author={book.author} startPlayback={startPlayback} {...track} cover={book.cover} key={k} index={k} />
        ))}
      </div>
    </>
  )
}
