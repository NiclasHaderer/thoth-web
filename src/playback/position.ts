import { Track } from "@thoth/client"

export const trackStartMs = (tracks: Track[], index: number): number =>
  tracks.slice(0, index).reduce((sum, track) => sum + track.durationMs, 0)

export const locateTrack = (tracks: Track[], positionMs: number): { index: number; offsetMs: number } => {
  let index = 0
  let offsetMs = Math.max(0, positionMs)
  while (index < tracks.length - 1 && offsetMs >= tracks[index].durationMs) offsetMs -= tracks[index++].durationMs
  return { index, offsetMs }
}
