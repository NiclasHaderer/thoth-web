import type { AudioOutput, PlaybackEvent, PlaybackSnapshot } from "./audio-output"

const EVENTS = [
  "timeupdate",
  "durationchange",
  "loadedmetadata",
  "play",
  "pause",
  "ended",
  "emptied",
  "ratechange",
  "volumechange",
]

let element: HTMLAudioElement | undefined

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

const media = (): HTMLAudioElement => (element ??= document.createElement("audio"))

export const htmlAudioOutput: AudioOutput = {
  // Before metadata loads, the element holds a currentTime write as its default playback start
  // position, applies it on loadedmetadata and reports it from the getter, so seeking a loading
  // source needs no queue of our own.
  currentTime: (): number => media().currentTime,
  duration: (): number => media().duration,
  play: () =>
    void media()
      .play()
      .catch(() => {}),
  pause: () => media().pause(),
  setPlaying: (shouldPlay: boolean) => (shouldPlay ? htmlAudioOutput.play() : htmlAudioOutput.pause()),
  seek: (seconds: number) => {
    media().currentTime = seconds
  },
  load: (src: string, seekSeconds: number, autoplay: boolean) => {
    const target = media()
    if (target.getAttribute("src") !== src) target.src = src
    target.currentTime = seekSeconds
    if (autoplay) htmlAudioOutput.play()
  },
  unload: () => {
    const target = media()
    target.pause()
    target.removeAttribute("src")
    target.load()
  },
  setSpeed: (speed: number) => {
    media().defaultPlaybackRate = speed
    media().playbackRate = speed
  },
  setVolume: (level: number) => {
    media().volume = clamp01(level)
  },
  snapshot: (): PlaybackSnapshot => {
    const target = media()
    return {
      paused: target.paused,
      currentTime: target.currentTime,
      duration: target.duration,
      volume: target.volume,
      speed: target.playbackRate,
    }
  },
  subscribe: (onChange: () => void) => {
    const target = media()
    EVENTS.forEach(event => target.addEventListener(event, onChange))
    return () => EVENTS.forEach(event => target.removeEventListener(event, onChange))
  },
  on: (event: PlaybackEvent, handler: () => void) => {
    const target = media()
    target.addEventListener(event, handler)
    return () => target.removeEventListener(event, handler)
  },
}
