import { create } from "zustand"
import { persist } from "zustand/middleware"
import { persistKey } from "@thoth/client/persist"

interface Preferences {
  volume: number
  playbackSpeed: number
  sideMenuCollapsed: boolean
}

export const usePreferences = create<Preferences>()(
  persist((): Preferences => ({ volume: 1, playbackSpeed: 1, sideMenuCollapsed: false }), {
    name: persistKey("preferences"),
    version: 1,
  })
)

export const preferences = {
  setVolume: (volume: number) => usePreferences.setState({ volume }),
  setPlaybackSpeed: (playbackSpeed: number) => usePreferences.setState({ playbackSpeed }),
  toggleSideMenu: () => usePreferences.setState(state => ({ sideMenuCollapsed: !state.sideMenuCollapsed })),
}
