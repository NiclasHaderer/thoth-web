import { DetailList } from "@/components/detail/detail-list.tsx"
import { usePlaybackState } from "@/state/playback.state.ts"
import { pluralize } from "@/utils/utils.ts"
import {
  BarcodeIcon,
  BuildingIcon,
  CalendarIcon,
  CirclePlayIcon,
  ClockIcon,
  ImageOffIcon,
  LanguagesIcon,
  LayersIcon,
  LucideIcon,
  MicIcon,
  StarIcon,
  TagsIcon,
  UserIcon,
} from "lucide-react"
import { FC, ReactNode, useState } from "react"
import { Book, BookDetailed, UUID } from "@thoth/client"
import { MobileDetailHeader } from "@thoth/components/detail/detail-layout"
import { ResourceActions } from "@thoth/components/generic/resource-actions"
import { HtmlViewer } from "@thoth/components/html-editor"
import { Link } from "@thoth/components/link.tsx"
import { Button } from "@thoth/components/ui/button"
import { usePlayState } from "@thoth/hooks/playback"
import { useBreakpoint } from "@thoth/hooks/use-media-query"
import { cn } from "@thoth/lib/utils"
import { isDetailedBook } from "@thoth/models/typeguards"
import { useAutoMatchBook, useBook } from "@thoth/queries/resources"
import { toRuntime } from "../track/helpers"
import { TrackList } from "../track/track-list"
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

interface CoverProps {
  book: Book
  className: string
}

const Cover: FC<CoverProps> = ({ book, className }) =>
  book.coverID ? (
    <img
      className={cn("border-border rounded-lg border object-cover shadow-lg shadow-black/25", className)}
      alt={book.title}
      src={`/api/stream/images/${book.coverID}`}
    />
  ) : (
    <div
      className={cn(
        "border-border text-muted-foreground/60 flex aspect-square items-center justify-center rounded-lg border",
        className
      )}
    >
      <ImageOffIcon className="size-2/5" />
    </div>
  )

interface MetaProps {
  book: Book
  libraryId: UUID
  runtime: number
}

const Meta: FC<MetaProps> = ({ book, libraryId, runtime }) => (
  <>
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
      {runtime ? <MetaItem icon={ClockIcon}>{toRuntime(runtime)}</MetaItem> : null}
      {book.releaseDate ? <MetaItem icon={CalendarIcon}>{new Date(book.releaseDate).getFullYear()}</MetaItem> : null}
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
  </>
)

const GenreLinks: FC<{ book: Book; libraryId: UUID }> = ({ book, libraryId }) => (
  <>
    {book.genres.map(genre => (
      <Link
        key={genre}
        href={`/libraries/${libraryId}/genres/${encodeURIComponent(genre)}`}
        className="text-muted-foreground min-w-0 truncate text-sm hover:underline"
      >
        {genre}
      </Link>
    ))}
  </>
)

interface HeaderProps extends MetaProps {
  tracks: number
  actions: ReactNode
}

const DesktopHeader: FC<HeaderProps> = ({ book, libraryId, runtime, actions }) => (
  <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-8 gap-y-5">
    <Cover book={book} className="w-56 shrink-0 self-center lg:w-64" />

    <div className="flex min-w-0 flex-col gap-2">
      <h1 className="min-w-0 text-4xl font-bold tracking-tight text-balance">{book.title}</h1>

      {book.providerRating || book.genres.length > 0 ? (
        <div className="flex min-w-0 items-center gap-x-5">
          {book.providerRating ? <Rating value={book.providerRating} /> : null}
          <GenreLinks book={book} libraryId={libraryId} />
        </div>
      ) : null}

      <div className="border-border/60 mt-1 flex flex-col gap-1.5 border-t pt-3">
        <Meta book={book} libraryId={libraryId} runtime={runtime} />
      </div>

      <div className="flex items-center gap-1.5 pt-4">{actions}</div>
    </div>

    {book.description ? (
      <div className="col-span-2">
        <HtmlViewer content={book.description} collapsedLines={3} />
      </div>
    ) : null}
  </div>
)

const MobileHeader: FC<HeaderProps> = ({ book, libraryId, runtime, tracks, actions }) => {
  const tracksLabel = tracks > 0 ? pluralize(tracks, "Track") : undefined

  return (
    <MobileDetailHeader
      title={book.title}
      backdrop={book.coverID ? `/api/stream/images/${book.coverID}` : undefined}
      art={<Cover book={book} className="w-full" />}
      actions={actions}
      revealTop={
        book.publisher ? <div className="text-muted-foreground pb-1.5 text-center text-sm">{book.publisher}</div> : null
      }
      stats={
        <>
          {book.providerRating ? <Rating value={book.providerRating} /> : null}
          {runtime ? <span>{toRuntime(runtime)}</span> : null}
          {tracksLabel ? <span>{tracksLabel}</span> : null}
        </>
      }
      revealBottom={
        <div className="flex flex-col gap-4 pt-4 text-left">
          {book.description ? <HtmlViewer content={book.description} collapsedLines={3} /> : null}

          <div className="border-border/60 flex flex-col gap-2 rounded-lg border p-4">
            <Meta book={book} libraryId={libraryId} runtime={0} />
            {book.genres.length > 0 ? (
              <MetaRow icon={TagsIcon}>
                <div className="flex min-w-0 gap-x-2">
                  <GenreLinks book={book} libraryId={libraryId} />
                </div>
              </MetaRow>
            ) : null}
          </div>
        </div>
      }
    />
  )
}

export const BookDetails: FC<{ bookId: UUID; libraryId: UUID }> = ({ bookId, libraryId }) => {
  const play = usePlaybackState(state => state.start)
  const current = usePlaybackState(state => state.current)
  const [isPlaying, setPlaying] = usePlayState()
  const isDesktop = useBreakpoint("md")
  const { data: book } = useBook(libraryId, bookId)
  const autoMatchBook = useAutoMatchBook()
  const [isEditing, setEditing] = useState(false)

  if (!book) return <></>

  const currentId = current?.book.id === bookId ? current.id : undefined

  const tracks = isDetailedBook(book) ? book.tracks : []
  const totalDuration = tracks.reduce((sum, track) => sum + track.duration, 0)

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

  const actions = (
    <>
      <Button
        onPress={() => startPlayback(0)}
        isDisabled={tracks.length === 0}
        className="h-11 grow px-5 md:h-10 md:grow-0"
      >
        <CirclePlayIcon className="mr-2" /> Play
      </Button>
      <ResourceActions
        libraryId={libraryId}
        id={book.id}
        label="book"
        autoMatch={autoMatchBook}
        onEdit={() => setEditing(true)}
      />
      <BookEdit book={book} isOpen={isEditing} onOpenChange={setEditing} />
    </>
  )

  const Header = isDesktop ? DesktopHeader : MobileHeader

  return (
    <div className="mx-auto max-w-5xl min-w-0">
      <Header book={book} libraryId={libraryId} runtime={totalDuration} tracks={tracks.length} actions={actions} />

      {tracks.length > 0 ? (
        <TrackList
          className="pt-8 md:pt-10"
          label={pluralize(tracks.length, "Track")}
          trailing={totalDuration ? toRuntime(totalDuration) : undefined}
          tracks={tracks}
          activeId={currentId}
          playing={isPlaying}
          onStart={startPlayback}
          onToggle={setPlaying}
        />
      ) : null}
    </div>
  )
}
export default BookDetails
