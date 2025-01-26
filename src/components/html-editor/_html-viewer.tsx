import dompurify from "dompurify"
import { FC } from "react"

export const _HtmlViewer: FC<{
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
        dangerouslySetInnerHTML={{ __html: dompurify.sanitize(content ?? "") }}
      />
    </>
  )
}
