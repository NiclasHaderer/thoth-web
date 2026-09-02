import { create } from "zustand"
import { NamedId, Track, UUID } from "@thoth/client"

export interface PlayingBook {
  libraryId: UUID
  id: UUID
  title: string
  durationMs: number
  authors: NamedId[]
  coverID: UUID | undefined
  tracks: Track[]
}

export interface PlaybackState {
  book: PlayingBook | null
  trackIndex: number
}

export const usePlayback = create<PlaybackState>(() => ({ book: null, trackIndex: 0 }))

export const currentTrack = (state: PlaybackState): Track | undefined => state.book?.tracks[state.trackIndex]

export const hasNextTrack = (state: PlaybackState): boolean =>
  !!state.book && state.trackIndex < state.book.tracks.length - 1

// Book-level position of whatever is playing, published once per second so any view showing that
// book (previews, continue listening, details) follows playback without subscribing to audio events.
interface PlaybackProgress {
  libraryId: UUID | null
  bookId: UUID | null
  positionMs: number
}

export const usePlaybackProgress = create<PlaybackProgress>(() => ({ libraryId: null, bookId: null, positionMs: 0 }))
