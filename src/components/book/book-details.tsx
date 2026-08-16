import { usePlaybackState } from "@/state/playback.state.ts"
import { pluralize } from "@/utils/utils.ts"
import { CirclePlayIcon, ImageOffIcon, StarIcon } from "lucide-react"
import { FC, Fragment, ReactNode } from "react"
import { Link } from "wouter"
import { BookDetailed, UUID } from "@thoth/client"
import { DetailLayout, DetailRail, RailItem, entityLink } from "@thoth/components/detail/detail-layout"
import { HtmlViewer } from "@thoth/components/html-editor"
import { Badge } from "@thoth/components/ui/badge"
import { Button } from "@thoth/components/ui/button"
import { usePlayState } from "@thoth/hooks/playback"
import { isDetailedBook } from "@thoth/models/typeguards"
import { useBook } from "@thoth/queries/resources"
import { toReadableTime } from "../track/helpers"
import { Track, TrackState } from "../track/track"
import { BookEdit } from "./book-edit"

const RATING_MAX = 5

const Rating: FC<{ value: number }> = ({ value }) => {
  const stars = Array.from({ length: RATING_MAX }, (_, index) => index)
  const filled = (Math.min(Math.max(value, 0), RATING_MAX) / RATING_MAX) * 100

  return (
    <div className="flex items-center gap-1.5">
      <div aria-hidden className="relative">
        <div className="text-muted-foreground/35 flex">
          {stars.map(index => (
            <StarIcon key={index} className="size-4" />
          ))}
        </div>
        <div className="absolute inset-y-0 left-0 flex overflow-hidden text-amber-400" style={{ width: `${filled}%` }}>
          {stars.map(index => (
            <StarIcon key={index} className="size-4 shrink-0 fill-current" />
          ))}
        </div>
      </div>
      <span className="text-muted-foreground text-xs tabular-nums">{value.toFixed(1)}</span>
    </div>
  )
}

export const BookDetails: FC<{ bookId: UUID; libraryId: UUID }> = ({ bookId, libraryId }) => {
  const play = usePlaybackState(state => state.start)
  const current = usePlaybackState(state => state.current)
  const [isPlaying] = usePlayState()
  const { data: book } = useBook(libraryId, bookId)

  if (!book) return <></>

  const currentId = current?.book.id === bookId ? current.id : undefined
  const trackState = (id: UUID): TrackState => (id === currentId ? (isPlaying ? "playing" : "paused") : "idle")

  const tracks = isDetailedBook(book) ? book.tracks : []
  const totalDuration = tracks.reduce((sum, track) => sum + track.duration, 0)
  const year = book.releaseDate ? new Date(book.releaseDate).getFullYear() : undefined

  const startPlayback = (position: number) => {
    const bookTracks = (book as BookDetailed).tracks

    const start = { ...bookTracks[position], authors: book.authors, coverID: book.coverID, libraryId }
    const queue = bookTracks.slice(position + 1, bookTracks.length).map(q => ({
      ...q,
      authors: book.authors,
      coverID: book.coverID,
      libraryId,
    }))
    const history = bookTracks
      .slice(0, position)
      .map(q => ({ ...q, authors: book.authors, coverID: book.coverID, libraryId }))

    play(start, queue, history)
  }

  const facts: ReactNode[] = []
  if (book.authors.length > 0) {
    facts.push(
      <span className="flex flex-wrap gap-x-1">
        {book.authors.map((author, index) => (
          <Link key={author.id} href={`/libraries/${libraryId}/authors/${author.id}`} className={entityLink}>
            {author.name}
            {index < book.authors.length - 1 ? "," : ""}
          </Link>
        ))}
      </span>
    )
  }
  if (year) facts.push(year)
  if (book.language) facts.push(<span className="capitalize">{book.language}</span>)

  const hasRail = book.genres.length > 0 || book.publisher || book.isbn || book.providerRating

  return (
    <DetailLayout
      title={book.title}
      image={book.coverID ? `/api/stream/images/${book.coverID}` : undefined}
      fallbackIcon={ImageOffIcon}
      facts={facts}
      details={
        <>
          {book.narrators.length > 0 ? (
            <p className="text-muted-foreground text-sm">
              Narrated by{" "}
              {book.narrators.map((narrator, index) => (
                <Fragment key={narrator}>
                  {index > 0 ? ", " : ""}
                  <Link
                    href={`/libraries/${libraryId}/narrators/${encodeURIComponent(narrator)}`}
                    className={entityLink}
                  >
                    {narrator}
                  </Link>
                </Fragment>
              ))}
            </p>
          ) : null}

          {book.series.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {book.series.map(series => (
                <Badge
                  key={series.id}
                  variant="secondary"
                  render={props => <Link {...props} href={`/libraries/${libraryId}/series/${series.id}`} />}
                >
                  {series.title}
                </Badge>
              ))}
            </div>
          ) : null}
        </>
      }
      actions={
        <>
          <Button onPress={() => startPlayback(0)} isDisabled={tracks.length === 0} className="grow sm:grow-0">
            <CirclePlayIcon className="mr-2" /> Play
          </Button>
          <BookEdit book={book} />
        </>
      }
      aside={
        hasRail ? (
          <DetailRail>
            {book.genres.length > 0 ? (
              <RailItem label="Genres" className="col-span-full">
                <div className="flex flex-wrap gap-1.5">
                  {book.genres.map(genre => (
                    <Badge
                      key={genre}
                      variant="outline"
                      render={props => (
                        <Link {...props} href={`/libraries/${libraryId}/genres/${encodeURIComponent(genre)}`} />
                      )}
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>
              </RailItem>
            ) : null}

            {book.publisher ? <RailItem label="Publisher">{book.publisher}</RailItem> : null}
            {book.isbn ? <RailItem label="ISBN">{book.isbn}</RailItem> : null}
            {book.providerRating ? (
              <RailItem label="Rating">
                <Rating value={book.providerRating} />
              </RailItem>
            ) : null}
          </DetailRail>
        ) : null
      }
    >
      {book.description ? (
        <div className="pb-10">
          <HtmlViewer content={book.description} title="Description" collapsedLines={3} />
        </div>
      ) : null}

      {tracks.length > 0 ? (
        <section className="max-w-prose">
          <h2 className="flex items-baseline gap-3 pb-3 text-xl">
            {pluralize(tracks.length, "Track")}
            <span className="text-muted-foreground text-sm tabular-nums">{toReadableTime(totalDuration)}</span>
          </h2>
          <ul className="-mx-3 flex flex-col">
            {tracks.map((track, index) => (
              <Track
                key={track.id}
                {...track}
                state={trackState(track.id)}
                startPlayback={startPlayback}
                index={index}
              />
            ))}
          </ul>
        </section>
      ) : null}
    </DetailLayout>
  )
}
export default BookDetails
