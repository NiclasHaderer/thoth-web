import { Content } from "@tiptap/react"
import { FC, lazy, Suspense } from "react"
import { detailLabel } from "@thoth/components/detail/detail-layout"
import { Loading } from "@thoth/components/loading.tsx"
import { Skeleton } from "@thoth/components/ui/skeleton"
import { cn } from "@thoth/lib/utils"

const HtmlEditorImpl = lazy(() => import("./_html-editor.tsx").then(i => ({ default: i.HtmlEditorImpl })))
const HtmlViewerImpl = lazy(() => import("./_html-viewer.tsx").then(i => ({ default: i.HtmlViewerImpl })))

export const HtmlEditor: FC<{
  value?: Content
  placeholder?: string
  className?: string | undefined
  onChange?: (newValue: string | undefined) => void
}> = props => {
  return (
    <Suspense fallback={<Loading count={2} />}>
      <HtmlEditorImpl {...props} />
    </Suspense>
  )
}

const HtmlViewerFallback: FC<{ title?: string | undefined; lines: number }> = ({ title, lines }) => (
  <div aria-busy>
    {title ? <h2 className={`${detailLabel} pb-3`}>{title}</h2> : null}
    <div className="flex flex-col gap-3">
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton key={index} className={cn("h-4", index === lines - 1 && "w-2/3")} />
      ))}
    </div>
  </div>
)

export const HtmlViewer: FC<{
  content: string | null | undefined
  className?: string | undefined
  title?: string
  collapsedLines?: number
}> = props => {
  if (!props.content) return null

  return (
    <Suspense fallback={<HtmlViewerFallback title={props.title} lines={props.collapsedLines ?? 3} />}>
      <HtmlViewerImpl {...props} />
    </Suspense>
  )
}
