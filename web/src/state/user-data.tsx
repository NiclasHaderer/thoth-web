import { FC, ReactNode, useEffect, useState } from "react"
import { session, useSession } from "@thoth/client"
import { cache, persistKey } from "@thoth/client/persistence"
import { bookDownloads } from "@thoth/downloads"
import { playback } from "@thoth/playback"

const RESET_PENDING = persistKey("reset-pending")

let resetting: Promise<void> | undefined

const resetPending = () => localStorage.getItem(RESET_PENDING) !== null

// Deleting the downloads is not atomic, so the mark outlives a tab that dies mid-reset and the next start finishes it.
const resetUserData = () =>
  (resetting ??= (async () => {
    localStorage.setItem(RESET_PENDING, "1")
    playback.reset()
    await Promise.all([cache.reset(), bookDownloads.reset()])
      .then(() => localStorage.removeItem(RESET_PENDING))
      .catch(() => undefined)
  })().finally(() => (resetting = undefined)))

// Ending the session starts the reset synchronously (UserDataProvider listens for sign-out), so it is already running here.
export const logout = async (): Promise<void> => {
  await session.end()
  await resetting
}

// Covers both a deliberate logout and a session the client gave up on, so neither leaves the user's data behind.
const useResetOnSignOut = () => {
  useEffect(
    () =>
      useSession.subscribe((current, previous) => {
        if (previous.loggedIn && !current.loggedIn) void resetUserData()
      }),
    []
  )
}

const useFinishPendingReset = () => {
  const [done, setDone] = useState(() => !resetPending())

  useEffect(() => {
    if (!done) void resetUserData().then(() => setDone(true))
  }, [done])

  return done
}

export const UserDataProvider: FC<{ children: ReactNode }> = ({ children }) => {
  useResetOnSignOut()
  return useFinishPendingReset() ? children : null
}
