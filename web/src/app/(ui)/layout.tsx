import { CSSProperties, FC, ReactNode } from "react"
import { MobileTabBar } from "@thoth/components/menu/mobile-tab-bar"
import { AppBar } from "@thoth/components/menu/top-bar"
import { Playback } from "@thoth/components/playback"
import { RequireLogin } from "@thoth/components/require-login"
import { usePlaybackState } from "@thoth/state/playback.state"

export const UiLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const isPlaying = usePlaybackState(state => state.isPlaying)

  return (
    <RequireLogin>
      <AppBar />
      <div
        data-scroll-area
        style={{ "--dock-height": isPlaying ? "7.5rem" : "3.5rem" } as CSSProperties}
        className="flex min-h-0 grow flex-col overflow-y-auto"
      >
        {children}
      </div>
      <div className="bg-card/75 border-border/60 fixed inset-x-0 bottom-0 z-40 border-t-[0.5px] pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:static md:border-0 md:bg-transparent md:pb-0 md:backdrop-blur-none">
        <Playback />
        <MobileTabBar />
      </div>
    </RequireLogin>
  )
}
