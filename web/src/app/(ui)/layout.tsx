import { motion, MotionStyle, useMotionTemplate, useMotionValue, useTransform } from "motion/react"
import { FC, ReactNode, useCallback, useEffect, useRef } from "react"
import { MobileTabBar } from "@thoth/components/menu/mobile-tab-bar"
import { AppBar } from "@thoth/components/menu/top-bar"
import { MiniPlayer } from "@thoth/components/mini-player"
import { RequireLogin } from "@thoth/components/require-login"
import { useEvent } from "@thoth/hooks/events"
import { useFullscreenPlayer } from "@thoth/hooks/fullscreen-player"
import { cn } from "@thoth/lib/utils"
import { useSessionRefresh } from "@thoth/state/auth.state"

const NAV_HEIGHT = 56
const MINI_SHRINK = 520

export const UiLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const playerRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  useSessionRefresh()
  const player = useFullscreenPlayer()
  const miniBottom = useMotionValue(0)
  const bottomHeight = useMotionValue(0)
  const bottomHeightPx = useMotionTemplate`${bottomHeight}px`

  const measure = useCallback(() => {
    if (playerRef.current) miniBottom.set(playerRef.current.getBoundingClientRect().bottom)
    if (bottomRef.current) bottomHeight.set(bottomRef.current.offsetHeight)
  }, [miniBottom, bottomHeight])

  useEffect(() => {
    const observer = new ResizeObserver(measure)
    if (playerRef.current) observer.observe(playerRef.current)
    if (bottomRef.current) observer.observe(bottomRef.current)
    return () => observer.disconnect()
  }, [measure])

  useEvent(window, "resize", measure)

  const miniY = useTransform(() => Math.min(0, player.y.get() - miniBottom.get()))
  const miniScale = useTransform(miniY, [0, -MINI_SHRINK], [1, 0], { clamp: true })
  const navY = useTransform(player.progress, [0, 1], [0, NAV_HEIGHT])
  const navScale = useTransform(player.progress, [0, 1], [1, 0.8])
  const navOpacity = useTransform(player.progress, [0, 0.6], [1, 0], { clamp: true })

  return (
    <RequireLogin>
      <AppBar />
      <motion.div
        data-scroll-area
        style={{ "--bottom-height": bottomHeightPx } as MotionStyle}
        className="flex min-h-0 grow flex-col overflow-y-auto max-md:-mb-(--bottom-height) max-md:pb-(--bottom-height)"
      >
        {children}
      </motion.div>
      <div ref={bottomRef} className={cn("relative z-40 shrink-0", player.expanded && "pointer-events-none")}>
        <div ref={playerRef}>
          <motion.div style={{ y: miniY, scaleY: miniScale }} className="origin-bottom">
            <MiniPlayer player={player} />
          </motion.div>
        </div>
        <motion.div
          style={{ y: navY, scale: navScale, opacity: navOpacity }}
          className="bg-card/75 border-border/60 origin-bottom border-t-[0.5px] pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
        >
          <MobileTabBar />
        </motion.div>
      </div>
    </RequireLogin>
  )
}
