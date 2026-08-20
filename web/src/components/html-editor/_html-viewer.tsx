import dompurify from "dompurify"
import { motion } from "motion/react"
import { CSSProperties, FC, useEffect, useRef, useState } from "react"
import { detailLabel } from "@thoth/components/detail/detail-layout"
import { Button } from "@thoth/components/ui/button"

export const HtmlViewerImpl: FC<{
  content: string | null | undefined
  className?: string | undefined
  title?: string
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
    setCollapsedHeight(Math.min(height, element.scrollHeight))
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
      {title ? <h2 className={`${detailLabel} pb-3`}>{title}</h2> : null}
      <motion.div
        initial={false}
        animate={{ height: expanded || collapsedHeight === undefined ? "auto" : collapsedHeight }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        onAnimationComplete={() => !expanded && setClamped(true)}
        onClick={event => {
          if (!overflows || (event.target as HTMLElement).closest("a")) return
          // A selection means the tap was a text drag or long-press to copy, not a toggle.
          if (window.getSelection()?.isCollapsed === false) return
          toggle()
        }}
        className={`overflow-hidden ${overflows ? "cursor-pointer" : ""}`}
      >
        <div
          ref={contentRef}
          style={clamp}
          className={`prose prose-invert max-w-none ${className ?? ""}`}
          dangerouslySetInnerHTML={{ __html: dompurify.sanitize(content ?? "") }}
        />
      </motion.div>
      {collapsedLines !== undefined && overflows ? (
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" className="-mr-3" onPress={toggle}>
            {expanded ? "Show less" : "Show more"}
          </Button>
        </div>
      ) : null}
    </>
  )
}
