import { LargeMenu, SearchBar, SmallMenu } from "./app/menu/menu"
import { Playback } from "./app/playback"
import { RouterOutlet } from "./app/router-outlet"
import { CHANGE_LAYOUT, useBreakpoint } from "./hooks/breakpoints"
import { usePlaybackState } from "./state/playback.state"

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
