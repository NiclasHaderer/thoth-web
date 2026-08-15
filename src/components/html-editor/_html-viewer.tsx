import dompurify from "dompurify"
import { motion } from "motion/react"
import { CSSProperties, FC, useEffect, useRef, useState } from "react"
import { Button } from "@thoth/components/ui/button"

export const HtmlViewerImpl: FC<{
  content: string | null | undefined
  className?: string | undefined
  title: string
  collapsedLines?: number
}> = ({ content, className, title, collapsedLines }) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const [expanded, setExpanded] = useState(false)
  const [clamped, setClamped] = useState(true)
  const [collapsedHeight, setCollapsedHeight] = useState<number>()
  const [overflows, setOverflows] = useState(false)

  useEffect(() => {
    const element = contentRef.current
    if (!element || collapsedLines === undefined) return
    const height = parseFloat(getComputedStyle(element).lineHeight) * collapsedLines
    setCollapsedHeight(height)
    setOverflows(element.scrollHeight > height + 1)
  }, [content, collapsedLines])

  if (!content) return null

  const clamp: CSSProperties | undefined =
    collapsedLines !== undefined && clamped
      ? { display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: collapsedLines, overflow: "hidden" }
      : undefined

  // The ellipsis only comes back once the box has finished shrinking, otherwise
  // the text snaps to five lines while the container is still collapsing.
  const toggle = () => {
    if (expanded) return setExpanded(false)
    setClamped(false)
    setExpanded(true)
  }

  return (
    <>
      <h2 className="text-xl">{title}</h2>
      <motion.div
        initial={false}
        animate={{ height: expanded || collapsedHeight === undefined ? "auto" : collapsedHeight }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        onAnimationComplete={() => !expanded && setClamped(true)}
        className="overflow-hidden"
      >
        <div
          ref={contentRef}
          style={clamp}
          className={`prose prose-invert ${className ?? ""}`}
          dangerouslySetInnerHTML={{ __html: dompurify.sanitize(content ?? "") }}
        />
      </motion.div>
      {collapsedLines !== undefined && overflows ? (
        <div className="flex max-w-prose justify-end">
          <Button variant="ghost" size="sm" className="-mr-3" onPress={toggle}>
            {expanded ? "Show less" : "Show more"}
          </Button>
        </div>
      ) : null}
    </>
  )
}
