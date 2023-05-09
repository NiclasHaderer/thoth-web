import { CHANGE_LAYOUT, useBreakpoint } from "@thoth/hooks/breakpoints"
import { FC, PropsWithChildren } from "react"
import { LeftResourceMenu } from "@thoth/components/menu/left-menu"
import { BottomResourceMenu } from "@thoth/components/menu/bottom-menu"

export const LibraryResourceView: FC<PropsWithChildren> = ({ children }) => {
  const breakPoint = useBreakpoint()
  const isMD = breakPoint.matchDown(CHANGE_LAYOUT)

  // const isPlaying = usePlaybackState(state => state.isPlaying)
  // {isPlaying ? (
  //   <Playback className={isMD ? "border-b-2 border-solid border-primary border-opacity-25" : ""} />
  // ) : null}

  return (
    <>
      <div className={`flex-grow overflow-y-auto ${isMD ? "" : "flex"}`}>
        {isMD ? null : <LeftResourceMenu />}
        <main tabIndex={-1} className={`flex-grow overflow-y-auto overflow-x-hidden px-5 ${isMD ? "mt-4" : "mt-10"}`}>
          {children}
        </main>
      </div>

      {isMD ? <BottomResourceMenu /> : null}
    </>
  )
}
