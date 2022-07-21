import { LargeMenu, SearchBar, SmallMenu } from "./App/Menu/Menu"
import { Playback } from "./App/Playback"
import { RouterOutlet } from "./App/RouterOutlet"
import { CHANGE_LAYOUT, useBreakpoint } from "./Hooks/Breakpoint"
import { usePlaybackState } from "./State/Playback"

export const TopBar = () => <SearchBar />

export const BottomBar = () => {
  const breakPoint = useBreakpoint()
  const isMD = breakPoint.matchDown(CHANGE_LAYOUT)

  const isPlaying = usePlaybackState(state => state.isPlaying)

  return (
    <div>
      {isPlaying ? (
        <Playback className={isMD ? "border-b-2 border-solid border-primary border-opacity-25" : ""} />
      ) : null}
      {isMD ? <SmallMenu /> : null}
    </div>
  )
}

export const MainWindow = () => {
  const breakPoint = useBreakpoint()
  const isMD = breakPoint.matchDown(CHANGE_LAYOUT)

  return (
    <div className={`flex-grow overflow-y-auto ${isMD ? "" : "flex"}`}>
      {isMD ? null : <LargeMenu />}
      <main tabIndex={-1} className={`flex-grow overflow-y-auto overflow-x-hidden px-5 ${isMD ? "mt-4" : "mt-10"}`}>
        <RouterOutlet />
      </main>
    </div>
  )
}
