import { motion, useReducedMotion } from "motion/react"
import { FC, PropsWithChildren, useId } from "react"
import { cn } from "@thoth/lib/utils"

type TabIconProps = { active?: boolean; className?: string }

const TabIcon: FC<PropsWithChildren<TabIconProps>> = ({ active, className, children }) => {
  const maskId = useId()
  const reducedMotion = useReducedMotion()

  return (
    <motion.svg
      viewBox="0 0 512 512"
      stroke="currentColor"
      strokeWidth={32}
      aria-hidden
      animate={active && !reducedMotion ? { scale: [1, 1.16, 1] } : { scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn("fill-none", className)}
    >
      <mask id={maskId} maskUnits="userSpaceOnUse" x={0} y={0} width={512} height={512}>
        <rect width={512} height={512} fill="black" />
        <motion.rect
          width={512}
          height={512}
          fill="white"
          initial={false}
          animate={{ y: active ? 0 : 512 }}
          transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 240, damping: 26 }}
        />
      </mask>
      <g mask={`url(#${maskId})`} fill="currentColor" stroke="none">
        {children}
      </g>
      <g>{children}</g>
    </motion.svg>
  )
}

export const HomeTabIcon: FC<TabIconProps> = props => (
  <TabIcon {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M80 212v236a16 16 0 0 0 16 16h96V328a24 24 0 0 1 24-24h80a24 24 0 0 1 24 24v136h96a16 16 0 0 0 16-16V212"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M480 256 266.89 52c-5-5.28-16.69-5.34-21.78 0L32 256m368-77V64h-48v69"
    />
  </TabIcon>
)

export const BrowseTabIcon: FC<TabIconProps> = props => (
  <TabIcon {...props}>
    <rect width="176" height="176" x="48" y="48" strokeLinecap="round" strokeLinejoin="round" rx="20" ry="20" />
    <rect width="176" height="176" x="288" y="48" strokeLinecap="round" strokeLinejoin="round" rx="20" ry="20" />
    <rect width="176" height="176" x="48" y="288" strokeLinecap="round" strokeLinejoin="round" rx="20" ry="20" />
    <rect width="176" height="176" x="288" y="288" strokeLinecap="round" strokeLinejoin="round" rx="20" ry="20" />
  </TabIcon>
)

export const SearchTabIcon: FC<TabIconProps> = props => (
  <TabIcon {...props}>
    <path strokeMiterlimit="10" d="M221.09 64a157.09 157.09 0 1 0 157.09 157.09A157.1 157.1 0 0 0 221.09 64z" />
    <path strokeLinecap="round" strokeMiterlimit="10" d="M338.29 338.29 448 448" />
  </TabIcon>
)

export const YouTabIcon: FC<TabIconProps> = props => (
  <TabIcon {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M344 144c-3.92 52.87-44 96-88 96s-84.15-43.12-88-96c-4-55 35-96 88-96s92 42 88 96"
    />
    <path
      strokeMiterlimit="10"
      d="M256 304c-87 0-175.3 48-191.64 138.6C62.39 453.52 68.57 464 80 464h352c11.44 0 17.62-10.48 15.65-21.4C431.3 352 343 304 256 304z"
    />
  </TabIcon>
)
