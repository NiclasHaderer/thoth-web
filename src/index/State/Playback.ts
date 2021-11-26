import create from 'zustand';
import { TrackModel } from '../Models/Audiobook';

interface PlaybackState {
  isPlaying: boolean;
  history: TrackModel[];
  queue: TrackModel[];
  current: TrackModel | null;

  start(track: TrackModel, queue?: TrackModel[], history?: TrackModel[]): void;

  stop(): void;

  next(): void;

  previous(): void;
}

export const usePlaybackState = create<PlaybackState>((set, get) => ({
  isPlaying: false,
  history: [],
  queue: [],
  current: null,
  start(track: TrackModel, queue: TrackModel[] = [], history: TrackModel[] = []): void {
    set({
      isPlaying: true,
      history,
      queue,
      current: track,
    });
  },
  stop(): void {
    set({
      isPlaying: false,
      history: [],
      queue: [],
      current: null
    });
  },
  next(): void {
    const state = get();
    const next = state.queue.shift();
    if (!next) return state.stop();

    set({
      queue: [...state.queue],
      history: [...state.history, ...state.current ? [state.current] : []],
      current: next,
    });
  },
  previous(): void {
    const state = get();
    const previous = state.history.pop();
    if (!previous) return;

    set({
      queue: [...state.current ? [state.current] : [], ...state.queue],
      history: [...state.history],
      current: previous,
    });
  }
}));


