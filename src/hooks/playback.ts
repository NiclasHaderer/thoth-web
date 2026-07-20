import { useCallback, useEffect, useState, useSyncExternalStore } from "react"

export const useAudio = (
  url: string | undefined | null,
  autoplay = true
): [HTMLAudioElement | null, (url: string) => void] => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!url) return
    const audioElement = document.createElement("audio")
    audioElement.setAttribute("controls", "true")
    audioElement.src = url
    autoplay && void audioElement.play()
    // eslint-disable-next-line react-hooks/set-state-in-effect -- stores the created element so consumers re-render
    setAudio(audioElement)
    return () => {
      audioElement.pause()
      audioElement.remove()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url])

  return [
    audio,
    (url: string) => {
      if (!audio) return
      // eslint-disable-next-line react-hooks/immutability -- imperative HTMLAudioElement mutation
      audio.src = url
    },
  ]
}

const useAudioEvent = <T>(
  audio: HTMLAudioElement | undefined | null,
  events: string[],
  getSnapshot: (audio: HTMLAudioElement) => T,
  fallback: T
): T => {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (!audio) return () => {}
      events.forEach(event => audio.addEventListener(event, onChange))
      return () => events.forEach(event => audio.removeEventListener(event, onChange))
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [audio]
  )
  return useSyncExternalStore(subscribe, () => (audio ? getSnapshot(audio) : fallback))
}

export const usePosition = (
  audio: HTMLAudioElement | undefined | null
): [number | undefined, (seconds: number) => void] => {
  const position = useAudioEvent(audio, ["timeupdate"], a => a.currentTime, undefined)

  return [
    position,
    (seconds: number) => {
      if (!audio) return
      // eslint-disable-next-line react-hooks/immutability -- imperative HTMLAudioElement mutation
      audio.currentTime = seconds
    },
  ]
}

export const useDuration = (audio: HTMLAudioElement | undefined | null) => {
  return useAudioEvent(audio, ["durationchange"], a => a.duration, undefined)
}

export const usePercentage = (
  audio: HTMLAudioElement | undefined | null
): [number | undefined, (percentage: number) => void] => {
  const percentage = useAudioEvent(audio, ["timeupdate"], a => a.currentTime / a.duration, undefined)

  return [
    percentage,
    (percentage: number) => {
      if (!audio) return
      // eslint-disable-next-line react-hooks/immutability -- imperative HTMLAudioElement mutation
      audio.currentTime = Math.floor(audio.duration * percentage)
      void audio.play()
    },
  ]
}

export const usePlayState = (audio: HTMLAudioElement | undefined | null): [boolean, (shouldPlay: boolean) => void] => {
  const playing = useAudioEvent(audio, ["play", "pause"], a => !a.paused, false)

  return [
    playing,
    (shouldPlay: boolean) => {
      if (!audio) return
      if (shouldPlay) {
        void audio.play()
      } else {
        audio.pause()
      }
    },
  ]
}

export const useOnEnded = (audio: HTMLAudioElement | undefined | null, callback: () => void) => {
  useEffect(() => {
    if (!audio) return

    const ended = () => callback()

    audio.addEventListener("ended", ended)
    return () => {
      audio.removeEventListener("ended", ended)
    }
  }, [audio, callback])
}
