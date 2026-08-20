import { DetailList } from "@/components/detail/detail-list.tsx"
import { usePlaybackState } from "@/state/playback.state.ts"
import { pluralize } from "@/utils/utils.ts"
import {
  BarcodeIcon,
  BuildingIcon,
  CalendarIcon,
  ClockIcon,
  ImageOffIcon,
  LanguagesIcon,
  LayersIcon,
  LucideIcon,
  MicIcon,
  PlayIcon,
  StarIcon,
  UserIcon,
} from "lucide-react"
import { FC, ReactNode } from "react"
import { Link } from "wouter"
import { BookDetailed, UUID } from "@thoth/client"
import { detailLabel } from "@thoth/components/detail/detail-layout"
import { HtmlViewer } from "@thoth/components/html-editor"
import { Button } from "@thoth/components/ui/button"
import { usePlayState } from "@thoth/hooks/playback"
import { isDetailedBook } from "@thoth/models/typeguards"
import { useBook } from "@thoth/queries/resources"
import { toRuntime } from "../track/helpers"
import { Track, TrackState } from "../track/track"
import { BookEdit } from "./book-edit"

const RATING_MAX = 5

const Rating: FC<{ value: number }> = ({ value }) => {
  const stars = Array.from({ length: RATING_MAX }, (_, index) => index)
  const filled = (Math.min(Math.max(value, 0), RATING_MAX) / RATING_MAX) * 100

  return (
    <div className="flex items-center gap-2">
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
      <span className="text-sm tabular-nums">{value.toFixed(1)}</span>
    </div>
  )
}

const MetaRow: FC<{ icon: LucideIcon; children: ReactNode }> = ({ icon: Icon, children }) => (
  <div className="text-muted-foreground flex min-w-0 items-baseline gap-2 text-sm">
    <Icon aria-hidden className="size-4 shrink-0 translate-y-0.5" />
    <div className="min-w-0 grow">{children}</div>
  </div>
)

const MetaItem: FC<{ icon: LucideIcon; children: ReactNode }> = ({ icon: Icon, children }) => (
  <span className="text-muted-foreground flex items-center gap-1.5 text-sm whitespace-nowrap">
    <Icon aria-hidden className="size-4 shrink-0" />
    {children}
  </span>
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

  const cover = book.coverID ? `/api/stream/images/${book.coverID}` : undefined

  const actions = (
    <>
      <Button
        onPress={() => startPlayback(0)}
        isDisabled={tracks.length === 0}
        className="h-11 grow gap-2.5 px-6 text-base font-semibold sm:h-10 sm:grow-0"
      >
        <PlayIcon className="size-4 fill-current" /> Play
      </Button>
      <BookEdit book={book} />
    </>
  )

  return (
    <div className="mx-auto max-w-5xl min-w-0 pb-3">
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-5 gap-y-5 sm:gap-x-8">
        {cover ? (
          <img
            className="border-border w-24 shrink-0 self-center rounded-lg border object-cover shadow-lg shadow-black/25 sm:w-56 lg:w-64"
            alt={book.title}
            src={cover}
          />
        ) : (
          <div className="border-border text-muted-foreground/60 flex aspect-square w-24 shrink-0 items-center justify-center self-center rounded-lg border sm:w-56 lg:w-64">
            <ImageOffIcon className="size-2/5" />
          </div>
        )}

        <div className="flex min-w-0 flex-col gap-2">
          <h1 className="min-w-0 text-2xl font-bold tracking-tight text-balance sm:text-4xl">{book.title}</h1>

          {book.providerRating || book.genres.length > 0 ? (
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
              {book.providerRating ? <Rating value={book.providerRating} /> : null}
              {book.genres.map(genre => (
                <Link
                  key={genre}
                  href={`/libraries/${libraryId}/genres/${encodeURIComponent(genre)}`}
                  className="text-primary text-sm hover:underline"
                >
                  {genre}
                </Link>
              ))}
            </div>
          ) : null}

          <div className="border-border/60 mt-1 flex flex-col gap-1.5 border-t pt-3">
            {book.authors.length > 0 ? (
              <MetaRow icon={UserIcon}>
                <DetailList
                  items={book.authors.map(author => ({
                    key: author.id,
                    label: author.name,
                    href: `/libraries/${libraryId}/authors/${author.id}`,
                  }))}
                />
              </MetaRow>
            ) : null}

            {book.series.length > 0 ? (
              <MetaRow icon={LayersIcon}>
                <DetailList
                  items={book.series.map(series => ({
                    key: series.id,
                    label: series.title,
                    href: `/libraries/${libraryId}/series/${series.id}`,
                  }))}
                />
              </MetaRow>
            ) : null}

            {book.narrators.length > 0 ? (
              <MetaRow icon={MicIcon}>
                <DetailList
                  items={book.narrators.map(narrator => ({
                    key: narrator,
                    label: narrator,
                    href: `/libraries/${libraryId}/narrators/${encodeURIComponent(narrator)}`,
                  }))}
                />
              </MetaRow>
            ) : null}

            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
              {totalDuration ? <MetaItem icon={ClockIcon}>{toRuntime(totalDuration)}</MetaItem> : null}
              {year ? <MetaItem icon={CalendarIcon}>{year}</MetaItem> : null}
              {book.publisher ? <MetaItem icon={BuildingIcon}>{book.publisher}</MetaItem> : null}
              {book.language ? (
                <MetaItem icon={LanguagesIcon}>
                  <span className="capitalize">{book.language}</span>
                </MetaItem>
              ) : null}
              {book.isbn ? (
                <MetaItem icon={BarcodeIcon}>
                  <span className="tabular-nums">{book.isbn}</span>
                </MetaItem>
              ) : null}
            </div>
          </div>

          <div className="hidden items-center gap-1.5 pt-4 sm:flex">{actions}</div>
        </div>

        <div className="col-span-2 flex items-center gap-1.5 sm:hidden">{actions}</div>

        {book.description ? (
          <div className="col-span-2">
            <HtmlViewer content={book.description} collapsedLines={3} />
          </div>
        ) : null}
      </div>

      {tracks.length > 0 ? (
        <section className="pt-10">
          <h2 className={`${detailLabel} flex justify-end gap-2 pb-2.5`}>
            <span>{pluralize(tracks.length, "Track")}</span>
            {totalDuration ? (
              <>
                <span aria-hidden>&middot;</span>
                <span>{toRuntime(totalDuration)}</span>
              </>
            ) : null}
          </h2>
          <ul className="border-border/60 flex flex-col border-t">
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
  )
}
export default BookDetails
