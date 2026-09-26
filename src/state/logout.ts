import { endSession, sessionStore } from "@thoth/client"
import { purgePersistedCache } from "@thoth/client/persist"
import { queryClient } from "@thoth/client/query-client"
import { offline } from "@thoth/offline"

const PURGE_PENDING = "thoth-purge-pending"

// Deleting the downloads is not atomic, so the mark outlives a tab that dies mid-purge and the next start finishes it.
const purgeUserData = (): Promise<void> => {
  localStorage.setItem(PURGE_PENDING, "1")
  queryClient.clear()
  return Promise.all([purgePersistedCache(), offline.clearAll()])
    .then(() => localStorage.removeItem(PURGE_PENDING))
    .catch(() => undefined)
}

let purged = localStorage.getItem(PURGE_PENDING) ? purgeUserData() : Promise.resolve()

// Covers both a deliberate logout and a session the client gave up on, so neither leaves the user's data behind.
sessionStore.subscribe((session, previous) => {
  if (session.loggedIn || !previous.loggedIn) return
  purged = purgeUserData()
})

// The store notifies synchronously, so clearing the session above has already started the purge awaited here.
export const logout = async (): Promise<void> => {
  await endSession()
  await purged
}
