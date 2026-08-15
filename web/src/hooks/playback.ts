import { useQueryClient } from "@tanstack/react-query"
import { useCallback, useEffect, useSyncExternalStore } from "react"
import { UUID } from "@thoth/client"
import { bookDetailQuery } from "@thoth/queries/resources"
import { usePlaybackState } from "@thoth/state/playback.state"

let element: HTMLAudioElement | undefined
const audio = (): HTMLAudioElement => (element ??= document.createElement("audio"))

export const useAudioSource = (url: string | undefined | null, autoplay = true) => {
  useEffect(() => {
    const media = audio()
    if (!url) {
      media.pause()
      media.removeAttribute("src")
      media.load()
      return
    }
    media.src = url
    if (autoplay) void media.play().catch(() => {})
  }, [url, autoplay])
}

const useAudioEvent = <T>(events: string[], getSnapshot: (audio: HTMLAudioElement) => T): T => {
  const subscribe = useCallback((onChange: () => void) => {
    const media = audio()
    events.forEach(event => media.addEventListener(event, onChange))
    return () => events.forEach(event => media.removeEventListener(event, onChange))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return useSyncExternalStore(subscribe, () => getSnapshot(audio()))
}

export const usePosition = (): [number, (seconds: number) => void] => {
  const position = useAudioEvent(["timeupdate", "emptied"], a => a.currentTime)

  return [
    position,
    (seconds: number) => {
      audio().currentTime = seconds
    },
  ]
}

export const useDuration = (): number => useAudioEvent(["durationchange", "emptied"], a => a.duration)

export const usePercentage = (): [number | undefined, (percentage: number) => void] => {
  const percentage = useAudioEvent(["timeupdate", "emptied"], a =>
    Number.isFinite(a.duration) && a.duration > 0 ? a.currentTime / a.duration : undefined
  )

  return [
    percentage,
    (percentage: number) => {
      const media = audio()
      media.currentTime = Math.floor(media.duration * percentage)
      void media.play().catch(() => {})
    },
  ]
}

export const usePlayState = (): [boolean, (shouldPlay: boolean) => void] => {
  const playing = useAudioEvent(["play", "pause", "ended", "emptied"], a => !a.paused)

  return [
    playing,
    (shouldPlay: boolean) => {
      const media = audio()
      if (shouldPlay) {
        void media.play().catch(() => {})
      } else {
        media.pause()
      }
    },
  ]
}

export const useOnEnded = (callback: () => void) => {
  useEffect(() => {
    const media = audio()
    const ended = () => callback()

    media.addEventListener("ended", ended)
    return () => {
      media.removeEventListener("ended", ended)
    }
  }, [callback])
}

export const usePlayBook = () => {
  const play = usePlaybackState(s => s.start)
  const queryClient = useQueryClient()

  return async (libraryId: UUID, bookId: UUID) => {
    const book = await queryClient.fetchQuery(bookDetailQuery(libraryId, bookId)).catch(() => undefined)
    if (!book) return
    const [first, ...queue] = book.tracks.map(track => ({
      ...track,
      authors: book.authors,
      coverID: book.coverID,
      libraryId,
    }))
    if (!first) return
    play(first, queue)
  }
}
