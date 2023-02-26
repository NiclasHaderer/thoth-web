import React from "react"
import { Content } from "@tiptap/react"

const _HtmlEditor = React.lazy(() => import("./_html-editor"))

export const HtmlEditor: React.VFC<{
  value?: Content
  placeholder?: string
  className?: string | undefined
  onChange?: (newValue: string | null) => void
}> = props => {
  return (
    <React.Suspense fallback={<div />}>
      <_HtmlEditor {...props} />
    </React.Suspense>
  )
}
export default HtmlEditor
