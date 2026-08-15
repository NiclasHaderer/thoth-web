import { usePlaybackState } from "@/state/playback.state.ts"
import { pluralize } from "@/utils/utils.ts"
import { CirclePlayIcon, ImageOffIcon } from "lucide-react"
import { FC, Fragment, ReactNode } from "react"
import { Link } from "wouter"
import { BookDetailed, UUID } from "@thoth/client"
import { HtmlViewer } from "@thoth/components/html-editor"
import { Badge } from "@thoth/components/ui/badge"
import { Button } from "@thoth/components/ui/button"
import { usePlayState } from "@thoth/hooks/playback"
import { isDetailedBook } from "@thoth/models/typeguards"
import { useBook } from "@thoth/queries/resources"
import { toReadableTime } from "../track/helpers"
import { Track, TrackState } from "../track/track"
import { BookEdit } from "./book-edit"

const entityLink =
  "text-foreground underline decoration-muted-foreground/40 underline-offset-4 transition-colors hover:decoration-foreground"

const Dot = () => <span aria-hidden className="bg-muted-foreground/50 size-1 shrink-0 rounded-full" />

const RailItem: FC<{ label: string; children: ReactNode }> = ({ label, children }) => (
  <div>
    <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">{label}</dt>
    <dd className="pt-1 text-sm">{children}</dd>
  </div>
)

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
    <div className="mx-auto flex max-w-6xl flex-col gap-10 pb-3 lg:flex-row lg:gap-12">
      <div className="min-w-0 grow">
        <div className="flex flex-col gap-6 pb-10 sm:flex-row sm:gap-8">
          {book.coverID ? (
            <img
              className="border-border w-40 shrink-0 self-start rounded-lg border sm:w-52"
              alt={book.title}
              src={`/api/stream/images/${book.coverID}`}
            />
          ) : (
            <ImageOffIcon className="border-border text-muted-foreground size-40 shrink-0 self-start rounded-lg border p-10 sm:size-52" />
          )}

          <div className="flex min-w-0 flex-col items-start gap-3">
            <h1 className="text-3xl font-semibold text-balance">{book.title}</h1>

            {facts.length > 0 ? (
              <div className="text-muted-foreground flex flex-wrap items-center gap-x-2 text-sm">
                {facts.map((fact, index) => (
                  <Fragment key={index}>
                    {index > 0 ? <Dot /> : null}
                    {fact}
                  </Fragment>
                ))}
              </div>
            ) : null}

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

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button onPress={() => startPlayback(0)} isDisabled={tracks.length === 0}>
                <CirclePlayIcon className="mr-2" /> Play
              </Button>
              <BookEdit book={book} />
            </div>
          </div>
        </div>

        <div className="pb-10">
          <HtmlViewer content={book.description} title="Description" collapsedLines={3} />
        </div>

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
      </div>

      {hasRail ? (
        <aside className="lg:w-56 lg:shrink-0">
          <dl className="border-border flex flex-col gap-5 border-t pt-6 lg:border-t-0 lg:pt-0">
            {book.genres.length > 0 ? (
              <RailItem label="Genres">
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
            {book.providerRating ? <RailItem label="Rating">{book.providerRating.toFixed(1)}</RailItem> : null}
          </dl>
        </aside>
      ) : null}
    </div>
  )
}
export default BookDetails
