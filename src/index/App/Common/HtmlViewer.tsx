import React from "react"

const LazyHtmlViewer = React.lazy(() => import("./_HtmlViewer"))

export const HtmlViewer: React.VFC<{
  content: string | null | undefined
  className?: string | undefined
  title: string
}> = props => {
  return (
    <React.Suspense fallback={<div />}>
      <LazyHtmlViewer {...props} />
    </React.Suspense>
  )
}
