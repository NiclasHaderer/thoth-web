import { CircleCheckIcon, CirclePlayIcon, CircleIcon, ImageOffIcon } from "lucide-react"
import { FC } from "react"
import { Link } from "wouter"
import { BookDetailed, UUID } from "@thoth/client"
import { HtmlViewer } from "@thoth/components/html-editor"
import { Button } from "@thoth/components/ui/button"
import { isDetailedBook } from "@thoth/models/typeguards"
import { useBook } from "@thoth/queries/resources"
import { usePlaybackState } from "../../state/playback.state"
import { pluralize } from "../../utils/utils"
import { Track } from "../track/track"
import { BookEdit } from "./book-edit"

export const BookDetails: FC<{ bookId: UUID; libraryId: UUID }> = ({ bookId, libraryId }) => {
  const play = usePlaybackState(state => state.start)
  const { data: book } = useBook(libraryId, bookId)

  if (!book) return <></>

  const startPlayback = (position: number) => {
    const tracks = (book as BookDetailed).tracks

    const start = { ...tracks[position], authors: book.authors, coverID: book.coverID, libraryId }
    const queue = tracks.slice(position + 1, tracks.length).map(q => ({
      ...q,
      authors: book.authors,
      coverID: book.coverID,
      libraryId,
    }))
    const history = tracks
      .slice(0, position)
      .map(q => ({ ...q, authors: book.authors, coverID: book.coverID, libraryId }))

    play(start, queue, history)
  }

  return (
    <>
      <div className="flex pb-6">
        <div className="flex flex-col justify-around">
          {book.coverID ? (
            <img
              className="border-border w-40 rounded-md border-2 md:w-80"
              alt={book.title}
              src={`/api/stream/images/${book.coverID}`}
            />
          ) : (
            <ImageOffIcon className="border-border h-40 w-40 rounded-md border-2 md:h-80 md:w-80" />
          )}
        </div>
        <div className="flex grow flex-col justify-between pl-4 md:pl-10">
          <div>
            <h2 className="pb-3 text-2xl">{book.title}</h2>
            {book.releaseDate ? (
              <div className="flex pb-3">
                <h3 className="text-foreground min-w-40 pr-3 uppercase">Year</h3>
                <h3>{new Date(book.releaseDate).getFullYear()}</h3>
              </div>
            ) : null}
            <div className="flex pb-3">
              <h3 className="text-foreground min-w-40 pr-3 uppercase">Authors</h3>
              {book.authors.map(author => (
                <Link href={`/libraries/${libraryId}/authors/${author.id}`} key={author.id}>
                  <h3 className="group-focus:underline hover:underline focus:underline">{author.name}</h3>
                </Link>
              ))}
            </div>
            {book.narrators.length > 0 ? (
              <div className="flex pb-3">
                <h3 className="text-foreground min-w-40 pr-3 uppercase">Narrators</h3>
                <h3 className="flex flex-wrap gap-x-2">
                  {book.narrators.map(narrator => (
                    <Link
                      href={`/libraries/${libraryId}/narrators/${encodeURIComponent(narrator)}`}
                      key={narrator}
                      className="hover:underline focus:underline"
                    >
                      {narrator}
                    </Link>
                  ))}
                </h3>
              </div>
            ) : null}
            {book.genres.length > 0 ? (
              <div className="flex pb-3">
                <h3 className="text-foreground min-w-40 pr-3 uppercase">Genres</h3>
                <h3 className="flex flex-wrap gap-x-2">
                  {book.genres.map(genre => (
                    <Link
                      href={`/libraries/${libraryId}/genres/${encodeURIComponent(genre)}`}
                      key={genre}
                      className="hover:underline focus:underline"
                    >
                      {genre}
                    </Link>
                  ))}
                </h3>
              </div>
            ) : null}
            {book.series ? (
              <div className="flex pb-3">
                <h3 className="text-foreground min-w-40 pr-3 uppercase">Series</h3>
                {book.series.map(series => (
                  <Link href={`/libraries/${libraryId}/series/${series.id}`} key={series.id}>
                    <h3 className="group-focus:underline hover:underline">{series.title}</h3>
                  </Link>
                ))}
              </div>
            ) : null}
            {/*TODO fix this*/}
            {/*{book.seriesIndex ? (*/}
            {/*  <div className="flex pb-3">*/}
            {/*    <h3 className="min-w-40 pr-3 uppercase text-foreground">Series Index</h3>*/}
            {/*    <h3>{book.seriesIndex}</h3>*/}
            {/*  </div>*/}
            {/*) : null}*/}
            {book.language ? (
              <div className="flex pb-3">
                <h3 className="text-foreground min-w-40 pr-3 uppercase">Language</h3>
                <h3>{book.language}</h3>
              </div>
            ) : null}
          </div>
          <div className="mt-2">
            <Button className="mr-3" onPress={() => startPlayback(0)}>
              <CirclePlayIcon className="mr-2" /> Play
            </Button>

            <Button variant="secondary" className="mr-3">
              <CircleCheckIcon className="mr-2" />
              Done
              <CircleIcon className="ml-2" />
            </Button>

            <BookEdit book={book} />
          </div>
        </div>
      </div>
      <HtmlViewer content={book.description} className="min-w-full pb-6" title="Description" />
      <div>
        {isDetailedBook(book) ? (
          <>
            <h3 className="p-2 pb-6 text-xl">{pluralize(book.tracks.length, "Track")}</h3>
            {book.tracks.map((track, k) => (
              <Track
                authors={book.authors}
                startPlayback={startPlayback}
                {...track}
                coverID={book?.coverID}
                libraryId={libraryId}
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
