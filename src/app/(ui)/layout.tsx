import { FC, ReactNode, useCallback, useRef } from "react"
import { MobileTabBar } from "@thoth/components/menu/mobile-tab-bar"
import { AppBar } from "@thoth/components/menu/top-bar"
import { Playback } from "@thoth/components/playback"
import { RequireLogin } from "@thoth/components/require-login"
import { useSessionRefresh } from "@thoth/state/auth.state"

export const UiLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const scrollArea = useRef<HTMLDivElement>(null)
  useSessionRefresh()

  const measureDock = useCallback((dock: HTMLDivElement | null) => {
    if (!dock) return
    const observer = new ResizeObserver(([entry]) => {
      scrollArea.current?.style.setProperty("--dock-height", `${entry.borderBoxSize[0].blockSize}px`)
    })
    observer.observe(dock, { box: "border-box" })
    return () => observer.disconnect()
  }, [])

  return (
    <RequireLogin>
      <AppBar />
      <div
        data-scroll-area
        ref={scrollArea}
        className="flex min-h-0 grow flex-col overflow-y-auto [--dock-height:calc(3.5rem+env(safe-area-inset-bottom))]"
      >
        {children}
      </div>
      <div
        ref={measureDock}
        className="bg-card/75 border-border/60 fixed inset-x-0 bottom-0 z-40 border-t-[0.5px] pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:static md:border-0 md:bg-transparent md:pb-0 md:backdrop-blur-none"
      >
        <Playback />
        <MobileTabBar />
      </div>
    </RequireLogin>
  )
}
