import { sanitize } from "dompurify"
import React from "react"

export const HtmlViewer: React.FC<{
  content: string | null | undefined
  className?: string | undefined
  title: string
}> = ({ content, className, title }) => {
  if (!content) return null
  return (
    <>
      <h2 className="text-xl">{title}</h2>
      <div
        className={`prose prose-invert ${className ?? ""}`}
        dangerouslySetInnerHTML={{ __html: sanitize(content ?? "") }}
      />
    </>
  )
}
