import { motion, useSpring, useTransform } from "motion/react"
import { FC, createContext, useContext, useEffect } from "react"

export const PlayerPressContext = createContext(0)

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (index: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.4, ease: "easeInOut" as const, delay: index * 0.08 },
      opacity: { duration: 0.12, delay: index * 0.08 },
    },
  }),
}

const settle = { type: "spring", stiffness: 380, damping: 16 } as const
const morphSpring = { stiffness: 320, damping: 24 } as const

const SKIP_BACK = [
  "M17.971 4.285A2 2 0 0 1 21 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z",
  "M3 20V4",
]
const SKIP_FORWARD = [
  "M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z",
  "M21 4v16",
]
const ROTATE_CCW = ["M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", "M3 3v5h5"]
const ROTATE_CW = ["M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8", "M21 3v5h-5"]
const SQUARE = ["M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"]

const roundedBar = (x1: number, x2: number, r: number) => [
  [x1, 3 + r],
  [x1, 3],
  [x1 + r, 3],
  [x2 - r, 3],
  [x2, 3],
  [x2, 3 + r],
  [x2, 21 - r],
  [x2, 21],
  [x2 - r, 21],
  [x1 + r, 21],
  [x1, 21],
  [x1, 21 - r],
]

const roundedTriangle = (r: number) => {
  const edge = Math.hypot(14, 9)
  const ux = (14 / edge) * r
  const uy = (9 / edge) * r
  const tipIn = [20 - ux, 12 - uy]
  const tipOut = [20 - ux, 12 + uy]
  const tipMid = [20 - ux / 2, 12]
  return [
    [6, 3 + r],
    [6, 3],
    [6 + ux, 3 + uy],
    tipIn,
    [20 - ux / 2, 12 - uy / 2],
    tipMid,
    tipMid,
    [20 - ux / 2, 12 + uy / 2],
    tipOut,
    [6 + ux, 21 - uy],
    [6, 21],
    [6, 21 - r],
  ]
}

const TRIANGLE = roundedTriangle(2.5)
const BARS = [roundedBar(5, 10, 1.6), roundedBar(14, 19, 1.6)]

const lerpPath = (from: number[][], to: number[][], t: number) => {
  const c = from.map((p, i) => [p[0] + (to[i][0] - p[0]) * t, p[1] + (to[i][1] - p[1]) * t])
  const seg = (i: number) =>
    `L${c[i * 3][0]} ${c[i * 3][1]} Q${c[i * 3 + 1][0]} ${c[i * 3 + 1][1]} ${c[i * 3 + 2][0]} ${c[i * 3 + 2][1]}`
  return `M${c[2][0]} ${c[2][1]} ${seg(1)} ${seg(2)} ${seg(3)} ${seg(0)} Z`
}

type IconProps = { className?: string }

const DrawnIcon: FC<IconProps & { paths: string[]; fromRotate?: number; label?: number }> = ({
  paths,
  fromRotate = 0,
  label,
  className,
}) => {
  const presses = useContext(PlayerPressContext)
  return (
    <motion.svg
      key={presses}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={presses === 0 ? false : { rotate: fromRotate }}
      animate={{ rotate: 0, transition: settle }}
      className={className}
    >
      {paths.map((d, index) => (
        <motion.path
          key={index}
          d={d}
          custom={index}
          variants={draw}
          initial={presses === 0 ? false : "hidden"}
          animate="visible"
        />
      ))}
      {label !== undefined ? (
        <text
          x={12}
          y={12.5}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={7.5}
          fontWeight={600}
          stroke="none"
          fill="currentColor"
        >
          {label}
        </text>
      ) : null}
    </motion.svg>
  )
}

export const SkipBackIcon: FC<IconProps> = props => <DrawnIcon paths={SKIP_BACK} {...props} />
export const SkipForwardIcon: FC<IconProps> = props => <DrawnIcon paths={SKIP_FORWARD} {...props} />
export const RotateCcwIcon: FC<IconProps & { seconds?: number }> = ({ seconds, ...props }) => (
  <DrawnIcon paths={ROTATE_CCW} fromRotate={100} label={seconds} {...props} />
)
export const RotateCwIcon: FC<IconProps & { seconds?: number }> = ({ seconds, ...props }) => (
  <DrawnIcon paths={ROTATE_CW} fromRotate={-100} label={seconds} {...props} />
)
export const SquareIcon: FC<IconProps> = props => <DrawnIcon paths={SQUARE} {...props} />

export const PlayPauseIcon: FC<IconProps & { playing: boolean }> = ({ playing, className }) => {
  const progress = useSpring(playing ? 1 : 0, morphSpring)
  useEffect(() => {
    progress.set(playing ? 1 : 0)
  }, [playing, progress])
  const bar1 = useTransform(progress, t => lerpPath(TRIANGLE, BARS[0], Math.max(t, 0)))
  const bar2 = useTransform(progress, t => lerpPath(TRIANGLE, BARS[1], Math.max(t, 0)))
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <motion.path d={bar1} />
      <motion.path d={bar2} />
    </svg>
  )
}
