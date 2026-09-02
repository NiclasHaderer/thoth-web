import { useSyncExternalStore } from "react"

const VOLUME_KEY = "thoth.volume"
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
let pendingSeek: number | null = null

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

const media = (): HTMLAudioElement => {
  if (element) return element
  element = document.createElement("audio")
  const stored = Number(localStorage.getItem(VOLUME_KEY) ?? NaN)
  if (Number.isFinite(stored)) element.volume = clamp01(stored)
  element.addEventListener("loadedmetadata", () => {
    if (pendingSeek === null) return
    element!.currentTime = Math.min(Math.max(0, pendingSeek), element!.duration)
    pendingSeek = null
  })
  return element
}

const play = () =>
  void media()
    .play()
    .catch(() => {})

export const audio = {
  element: media,
  // While a new source is still loading this is the queued seek, so it always describes the
  // loaded track and never the previous one's leftover time.
  currentTime: (): number => pendingSeek ?? media().currentTime,
  duration: (): number => media().duration,
  play,
  pause: () => media().pause(),
  setPlaying: (shouldPlay: boolean) => (shouldPlay ? play() : media().pause()),
  seek: (seconds: number) => {
    if (pendingSeek !== null) pendingSeek = seconds
    else media().currentTime = seconds
  },
  load: (src: string, seekSeconds: number, autoplay: boolean) => {
    const target = media()
    if (target.getAttribute("src") === src) {
      pendingSeek = null
      target.currentTime = seekSeconds
    } else {
      pendingSeek = seekSeconds
      target.src = src
    }
    if (autoplay) play()
  },
  unload: () => {
    const target = media()
    pendingSeek = null
    target.pause()
    target.removeAttribute("src")
    target.load()
  },
  setRate: (rate: number) => {
    media().defaultPlaybackRate = rate
    media().playbackRate = rate
  },
  setVolume: (level: number) => {
    media().volume = clamp01(level)
    localStorage.setItem(VOLUME_KEY, String(media().volume))
  },
}

const subscribe = (onChange: () => void) => {
  const target = media()
  EVENTS.forEach(event => target.addEventListener(event, onChange))
  return () => EVENTS.forEach(event => target.removeEventListener(event, onChange))
}

// Reactive read of the element. The selector must return a primitive.
export const useAudio = <T extends string | number | boolean>(select: (media: HTMLAudioElement) => T): T =>
  useSyncExternalStore(subscribe, () => select(media()))
