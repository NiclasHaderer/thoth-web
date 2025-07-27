import { FC, PropsWithChildren } from "react"
import { UUID } from "@thoth/client"
import { BottomResourceMenu } from "@thoth/components/menu/bottom-menu"
import { LeftResourceMenu } from "@thoth/components/menu/left-menu"
import { Playback } from "@thoth/components/playback.tsx"
import { CHANGE_LAYOUT, useBreakpoint } from "@thoth/hooks/breakpoints"
import { usePlaybackState } from "@thoth/state/playback.state.ts"

interface LibraryResourceViewProps extends PropsWithChildren {
  libraryId: UUID
}

export const LibraryResourceView: FC<LibraryResourceViewProps> = ({ children, libraryId }) => {
  const breakPoint = useBreakpoint()
  const isMD = breakPoint.matchDown(CHANGE_LAYOUT)

  const isPlaying = usePlaybackState(state => state.isPlaying)

  return (
    <>
      <div className={`flex-grow overflow-y-auto ${isMD ? "" : "flex"}`}>
        {isMD ? null : <LeftResourceMenu libraryId={libraryId} />}
        <main tabIndex={-1} className={`flex-grow overflow-y-auto overflow-x-hidden px-5 ${isMD ? "mt-4" : "mt-10"}`}>
          {children}
        </main>
      </div>

      {isMD ? <BottomResourceMenu libraryId={libraryId} /> : null}
      {isPlaying ? (
        <Playback className={isMD ? "border-b-2 border-solid border-primary border-opacity-25" : ""} />
      ) : null}
    </>
  )
}
