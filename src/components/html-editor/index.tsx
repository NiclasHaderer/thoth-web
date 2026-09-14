import { Content } from "@tiptap/react"
import { FC } from "react"
import { CardSkeleton } from "@thoth/components/card-skeleton.tsx"
import { lazyView } from "@thoth/components/lazy-view.tsx"
import { Skeleton } from "@thoth/components/ui/skeleton"
import { cn } from "@thoth/lib/utils"

const HtmlEditorImpl = lazyView(
  async () => ({ default: (await import("./_html-editor.tsx")).HtmlEditorImpl }),
  () => <CardSkeleton count={3} />
)

export const HtmlEditor: FC<{
  value?: Content
  placeholder?: string
  className?: string | undefined
  onChange?: (newValue: string | undefined) => void
}> = props => {
  return <HtmlEditorImpl {...props} />
}

const HtmlViewerSkeleton: FC<{ lines: number }> = ({ lines }) => (
  <div aria-busy>
    <div className="flex flex-col gap-3">
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton key={index} className={cn("h-4", index === lines - 1 && "w-2/3")} />
      ))}
    </div>
  </div>
)

const HtmlViewerImpl = lazyView(
  async () => ({ default: (await import("./_html-viewer.tsx")).HtmlViewerImpl }),
  props => <HtmlViewerSkeleton lines={props.collapsedLines ?? 3} />
)

export const HtmlViewer: FC<{
  content: string | null | undefined
  className?: string | undefined
  collapsedLines?: number
}> = props => {
  if (!props.content) return null

  return <HtmlViewerImpl {...props} />
}
