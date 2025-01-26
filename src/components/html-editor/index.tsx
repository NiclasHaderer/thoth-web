import React, { FC, lazy, Suspense } from "react"
import { Content } from "@tiptap/react"

const _HtmlEditor = lazy(() => import("./_html-editor.tsx").then(i => ({ default: i._HtmlEditor })))
const _HtmlViewer = lazy(() => import("./_html-viewer.tsx").then(i => ({ default: i._HtmlViewer })))

export const HtmlEditor: FC<{
  value?: Content
  placeholder?: string
  className?: string | undefined
  onChange?: (newValue: string | null) => void
}> = props => {
  return (
    <React.Suspense fallback={"Loading..."}>
      <_HtmlEditor {...props} />
    </React.Suspense>
  )
}

export const HtmlViewer: FC<{
  content: string | null | undefined
  className?: string | undefined
  title: string
}> = props => {
  return (
    <Suspense fallback={"Loading ..."}>
      <_HtmlViewer {...props} />
    </Suspense>
  )
}
