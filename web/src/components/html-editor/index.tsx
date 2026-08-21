import { Content } from "@tiptap/react"
import { FC, lazy, Suspense } from "react"
import { Loading } from "@thoth/components/loading.tsx"

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

export const HtmlViewer: FC<{
  content: string | null | undefined
  className?: string | undefined
  title?: string
  collapsedLines?: number
}> = props => {
  return (
    <Suspense fallback={<></>}>
      <HtmlViewerImpl {...props} />
    </Suspense>
  )
}
