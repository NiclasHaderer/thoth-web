import { create } from "zustand"
import { persist } from "zustand/middleware"
import { persistKey } from "@thoth/client/persistence"

interface Preferences {
  volume: number
  playbackSpeed: number
  sideMenuCollapsed: boolean
  downloadsFromAllLibraries: boolean
}

export const usePreferences = create<Preferences>()(
  persist(
    (): Preferences => ({ volume: 1, playbackSpeed: 1, sideMenuCollapsed: false, downloadsFromAllLibraries: true }),
    {
      name: persistKey("preferences"),
      version: 1,
    }
  )
)

export const preferences = {
  setVolume: (volume: number) => usePreferences.setState({ volume }),
  setPlaybackSpeed: (playbackSpeed: number) => usePreferences.setState({ playbackSpeed }),
  toggleSideMenu: () => usePreferences.setState(state => ({ sideMenuCollapsed: !state.sideMenuCollapsed })),
  toggleDownloadsFromAllLibraries: () =>
    usePreferences.setState(state => ({ downloadsFromAllLibraries: !state.downloadsFromAllLibraries })),
}
