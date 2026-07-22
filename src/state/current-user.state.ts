import { create } from "zustand"
import { combine } from "zustand/middleware"
import { Api, ThothUserWithPermissions, UserPermissions } from "@thoth/client"

export type CurrentUser = ThothUserWithPermissions<UserPermissions>

// Dedupes concurrent first-load fetches so the four call sites share one request.
let inflight: Promise<CurrentUser | null> | null = null

export const useCurrentUserState = create(
  combine({ user: null as CurrentUser | null }, (set, get) => ({
    fetchCurrentUser: async (force = false): Promise<CurrentUser | null> => {
      const existing = get().user
      if (!force && existing) return existing
      if (!force && inflight) return inflight
      inflight = Api.getCurrentUser().then(res => {
        const user = res.success ? res.body : null
        set({ user })
        inflight = null
        return user
      })
      return inflight
    },
    setUsername: (username: string) => set(state => (state.user ? { user: { ...state.user, username } } : {})),
    clearCurrentUser: () => set({ user: null }),
  }))
)
