import { motion } from "motion/react"
import { FC, ReactNode } from "react"

export const CollapsibleLabel: FC<{ collapsed: boolean; children: ReactNode }> = ({ collapsed, children }) => (
  <motion.span
    initial={false}
    aria-hidden={collapsed}
    animate={{ opacity: collapsed ? 0 : 1 }}
    transition={{ duration: 0.1 }}
    className="flex min-w-0 grow items-center gap-3 overflow-hidden"
  >
    {children}
  </motion.span>
)
