import { FC } from "react"
import { usePlayback } from "@thoth/playback"
import { toReadableTime } from "./track/track-time-format"

export const ElapsedTime: FC = () => {
  const seconds = usePlayback(s => Math.floor(s.currentTime))
  return toReadableTime(seconds)
}

export const TrackDuration: FC = () => {
  const duration = usePlayback(s => s.duration)
  return toReadableTime(duration)
}
