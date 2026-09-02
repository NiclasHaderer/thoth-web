import { DetailList } from "@/components/detail/detail-list.tsx"
import { pluralize } from "@/utils/utils.ts"
import {
  BarcodeIcon,
  BuildingIcon,
  CalendarIcon,
  CheckIcon,
  CircleCheckIcon,
  CirclePlayIcon,
  ClockIcon,
  ImageOffIcon,
  LanguagesIcon,
  LayersIcon,
  LucideIcon,
  MicIcon,
  RotateCcwIcon,
  StarIcon,
  TagsIcon,
  UserIcon,
} from "lucide-react"
import { FC, ReactNode, useState } from "react"
import { Book, UUID } from "@thoth/client"
import { MobileDetailHeader } from "@thoth/components/detail/detail-layout"
import { ResourceActions } from "@thoth/components/generic/resource-actions"
import { HtmlViewer } from "@thoth/components/html-editor"
import { Link } from "@thoth/components/link.tsx"
import { Button } from "@thoth/components/ui/button"
import { DropdownMenuItem } from "@thoth/components/ui/dropdown-menu"
import { useBreakpoint } from "@thoth/hooks/use-media-query"
import { cn } from "@thoth/lib/utils"
import { isDetailedBook } from "@thoth/models/typeguards"
import {
  audio,
  startBook,
  startTrack,
  useBookProgress,
  useCurrentTrack,
  usePlayback,
  usePlaying,
} from "@thoth/playback"
import { useAutoMatchBook, useBook, useResetBookProgress, useSetBookFinished } from "@thoth/queries/resources"
import { toReadableTime, toRuntime } from "../track/helpers"
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

const BookProgress: FC<{ book: Book; className?: string }> = ({ book, className }) => {
  const { inProgress, remainingMs } = useBookProgress(book)

  // Height is reserved even without progress so starting playback does not shift the layout.
  return (
    <div className={cn("text-muted-foreground min-h-[1lh] text-xs whitespace-nowrap", className)}>
      {inProgress ? `${toReadableTime(remainingMs / 1000)} left` : null}
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

// Isolated so live position updates only re-render the overlay, not the whole page.
const CoverIndicators: FC<{ book: Book }> = ({ book }) => {
  const { finished, inProgress, fraction } = useBookProgress(book)

  return (
    <>
      {finished ? (
        <div
          aria-label="Played"
          className="absolute top-0 right-0 flex size-11 items-center justify-center rounded-bl-lg bg-black/55 text-white/90 backdrop-blur-sm"
        >
          <CheckIcon className="size-5" strokeWidth={2.5} />
        </div>
      ) : null}
      {inProgress ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-black/60 backdrop-blur-sm">
          <div
            className="bg-primary h-full transition-[width] duration-300 ease-linear"
            style={{ width: `${fraction * 100}%` }}
          />
        </div>
      ) : null}
    </>
  )
}

const Cover: FC<CoverProps> = ({ book, className }) => (
  <div className={cn("relative overflow-hidden rounded-lg", className)}>
    {book.coverID ? (
      <img
        className="border-border w-full rounded-lg border object-cover shadow-lg shadow-black/25"
        alt={book.title}
        src={`/api/stream/images/${book.coverID}`}
      />
    ) : (
      <div className="border-border text-muted-foreground/60 flex aspect-square w-full items-center justify-center rounded-lg border">
        <ImageOffIcon className="size-2/5" />
      </div>
    )}
    <CoverIndicators book={book} />
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
    <div className="flex w-56 shrink-0 flex-col gap-2 self-center lg:w-64">
      <Cover book={book} className="w-full" />
      <BookProgress book={book} className="text-center" />
    </div>

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
          <BookProgress book={book} />
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
  const isCurrentBook = usePlayback(s => s.book?.id === bookId)
  const currentTrack = useCurrentTrack()
  const isPlaying = usePlaying()
  const isDesktop = useBreakpoint("md")
  const { data: book } = useBook(libraryId, bookId)
  const autoMatchBook = useAutoMatchBook()
  const setFinished = useSetBookFinished()
  const resetProgress = useResetBookProgress()
  const [isEditing, setEditing] = useState(false)

  if (!book) return <></>

  const currentTrackId = isCurrentBook ? currentTrack?.id : undefined

  const tracks = isDetailedBook(book) ? book.tracks : []
  const totalDuration = tracks.reduce((sum, track) => sum + track.durationMs / 1000, 0)

  const startPlayback = (index: number) => {
    if (isDetailedBook(book)) startTrack(book, libraryId, index)
  }

  const inProgress = book.status === "IN_PROGRESS" && book.durationMs > 0
  const isFinished = book.status === "FINISHED"

  const actions = (
    <>
      <Button
        onPress={() => {
          if (isCurrentBook) return audio.play()
          if (isDetailedBook(book)) startBook(book, libraryId, inProgress ? book.positionMs : 0)
        }}
        isDisabled={tracks.length === 0}
        className="h-11 grow px-5 md:h-10 md:grow-0"
      >
        <CirclePlayIcon className="mr-2" /> {isCurrentBook || inProgress ? "Resume" : "Play"}
      </Button>
      <Button
        variant="ghost"
        size="icon-lg"
        aria-label={isFinished ? "Mark as unplayed" : "Mark as played"}
        isDisabled={setFinished.isPending}
        onPress={() => setFinished.mutate({ libraryId, id: book.id, finished: !isFinished })}
        className={cn(
          "aspect-square h-11 w-auto! shrink-0 grow-0! rounded-full px-0! sm:h-10",
          isFinished ? "text-primary" : "text-muted-foreground hover:text-foreground"
        )}
      >
        {isFinished ? (
          <CircleCheckIcon className="[&>path]:stroke-background size-5 fill-current" />
        ) : (
          <CircleCheckIcon className="size-5" />
        )}
      </Button>
      <ResourceActions
        libraryId={libraryId}
        id={book.id}
        label="book"
        autoMatch={autoMatchBook}
        onEdit={() => setEditing(true)}
      >
        <DropdownMenuItem
          className="gap-2.5 rounded-lg px-2.5 py-2 text-sm"
          isDisabled={resetProgress.isPending || (book.positionMs === 0 && book.status === "UNPLAYED")}
          onAction={() => {
            resetProgress.mutate({ libraryId, id: book.id })
            // Otherwise the running playback keeps its position and syncs it straight back.
            if (isCurrentBook && isDetailedBook(book)) startBook(book, libraryId, 0, isPlaying)
          }}
        >
          <RotateCcwIcon className="text-muted-foreground size-5" />
          Reset progress
        </DropdownMenuItem>
      </ResourceActions>
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
          activeId={currentTrackId}
          playing={isPlaying}
          onStart={startPlayback}
          onToggle={audio.setPlaying}
        />
      ) : null}
    </div>
  )
}
export default BookDetails
