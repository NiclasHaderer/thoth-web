export interface PlaybackSnapshot {
  paused: boolean
  currentTime: number
  duration: number
  volume: number
  speed: number
}

export type PlaybackEvent = "timeupdate" | "play" | "pause" | "seeked" | "ended"

export interface AudioOutput {
  currentTime: () => number
  duration: () => number
  play: () => void
  pause: () => void
  setPlaying: (shouldPlay: boolean) => void
  seek: (seconds: number) => void
  load: (src: string, seekSeconds: number, autoplay: boolean) => void
  unload: () => void
  setSpeed: (speed: number) => void
  setVolume: (level: number) => void
  snapshot: () => PlaybackSnapshot
  subscribe: (onChange: () => void) => () => void
  on: (event: PlaybackEvent, handler: () => void) => () => void
}
