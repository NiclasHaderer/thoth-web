import { LargeMenu, SearchBar, SmallMenu } from "@thoth/components/menu/menu"
import { CHANGE_LAYOUT, useBreakpoint } from "@thoth/hooks/breakpoints"
import { usePlaybackState } from "@thoth/state/playback.state"
import { Playback } from "@thoth/components/playback"
import { FC, PropsWithChildren } from "react"
import { NoSsr } from "@thoth/components/no-ssr"

export const TopBar = () => <SearchBar />

export const BottomBar = () => {
  const breakPoint = useBreakpoint()
  const isMD = breakPoint.matchDown(CHANGE_LAYOUT)

  const isPlaying = usePlaybackState(state => state.isPlaying)

  return (
    <NoSsr>
      <div>
        {isPlaying ? (
          <Playback className={isMD ? "border-b-2 border-solid border-primary border-opacity-25" : ""} />
        ) : null}

        {isMD ? <SmallMenu /> : null}
      </div>
    </NoSsr>
  )
}

export const MainWindow: FC<PropsWithChildren> = ({ children }) => {
  const breakPoint = useBreakpoint()
  const isMD = breakPoint.matchDown(CHANGE_LAYOUT)

  return (
    <div className={`flex-grow overflow-y-auto ${isMD ? "" : "flex"}`}>
      {isMD ? null : <LargeMenu />}
      <main tabIndex={-1} className={`flex-grow overflow-y-auto overflow-x-hidden px-5 ${isMD ? "mt-4" : "mt-10"}`}>
        {children}
      </main>
    </div>
  )
}
