import { useAnimate, useReducedMotion } from "motion/react"
import { FC, useEffect, useRef } from "react"
import { cn } from "@thoth/lib/utils"

type Shape = {
  d: string
  strokeLinecap?: "round"
  strokeLinejoin?: "round"
  strokeMiterlimit?: number
}

export type TabIconProps = { active?: boolean; retap?: number; className?: string }

const TabIcon: FC<TabIconProps & { shapes: Shape[] }> = ({ active, retap = 0, className, shapes }) => {
  const [scope, animate] = useAnimate<SVGSVGElement>()
  const reducedMotion = useReducedMotion()
  const wasActive = useRef(active)
  const previousRetap = useRef(retap)

  useEffect(() => {
    const justActivated = active && !wasActive.current
    wasActive.current = active
    if (!justActivated || reducedMotion || !scope.current) return
    animate(scope.current, { opacity: [0, 1] }, { type: "tween", duration: 0.27, ease: "easeOut" })
  }, [active, animate, reducedMotion, scope])

  useEffect(() => {
    const retapped = retap !== previousRetap.current
    previousRetap.current = retap
    if (!retapped || !active || reducedMotion || !scope.current) return
    animate(scope.current, { y: [0, -5, 0] }, { type: "tween", duration: 0.34, ease: "easeOut" })
  }, [retap, active, animate, reducedMotion, scope])

  return (
    <svg
      ref={scope}
      viewBox="0 0 512 512"
      stroke="currentColor"
      strokeWidth={32}
      aria-hidden
      className={cn("fill-none", className)}
    >
      <g
        fill="currentColor"
        stroke="none"
        className={cn(
          "transition-opacity duration-300 motion-reduce:transition-none",
          active ? "opacity-100" : "opacity-0"
        )}
      >
        {shapes.map((shape, index) => (
          <path key={index} {...shape} />
        ))}
      </g>
      {shapes.map((shape, index) => (
        <path key={index} {...shape} />
      ))}
    </svg>
  )
}

const HOME: Shape[] = [
  {
    d: "M80 212v236a16 16 0 0 0 16 16h96V328a24 24 0 0 1 24-24h80a24 24 0 0 1 24 24v136h96a16 16 0 0 0 16-16V212",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  },
  {
    d: "M480 256 266.89 52c-5-5.28-16.69-5.34-21.78 0L32 256m368-77V64h-48v69",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  },
]

const BROWSE: Shape[] = [
  {
    d: "M68 48H204A20 20 0 0 1 224 68V204A20 20 0 0 1 204 224H68A20 20 0 0 1 48 204V68A20 20 0 0 1 68 48Z",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  },
  {
    d: "M308 48H444A20 20 0 0 1 464 68V204A20 20 0 0 1 444 224H308A20 20 0 0 1 288 204V68A20 20 0 0 1 308 48Z",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  },
  {
    d: "M68 288H204A20 20 0 0 1 224 308V444A20 20 0 0 1 204 464H68A20 20 0 0 1 48 444V308A20 20 0 0 1 68 288Z",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  },
  {
    d: "M308 288H444A20 20 0 0 1 464 308V444A20 20 0 0 1 444 464H308A20 20 0 0 1 288 444V308A20 20 0 0 1 308 288Z",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  },
]

const SEARCH: Shape[] = [
  { d: "M221.09 64a157.09 157.09 0 1 0 157.09 157.09A157.1 157.1 0 0 0 221.09 64z", strokeMiterlimit: 10 },
  { d: "M338.29 338.29 448 448", strokeLinecap: "round", strokeMiterlimit: 10 },
]

const YOU: Shape[] = [
  {
    d: "M344 144c-3.92 52.87-44 96-88 96s-84.15-43.12-88-96c-4-55 35-96 88-96s92 42 88 96",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  },
  {
    d: "M256 304c-87 0-175.3 48-191.64 138.6C62.39 453.52 68.57 464 80 464h352c11.44 0 17.62-10.48 15.65-21.4C431.3 352 343 304 256 304z",
    strokeMiterlimit: 10,
  },
]

export const HomeTabIcon: FC<TabIconProps> = props => <TabIcon {...props} shapes={HOME} />

export const BrowseTabIcon: FC<TabIconProps> = props => <TabIcon {...props} shapes={BROWSE} />

export const SearchTabIcon: FC<TabIconProps> = props => <TabIcon {...props} shapes={SEARCH} />

export const YouTabIcon: FC<TabIconProps> = props => <TabIcon {...props} shapes={YOU} />
