import { sanitize } from "dompurify"

export const HtmlViewer: React.VFC<{
  content: string | null | undefined
  className?: string | undefined
  title: string
}> = ({ content, className, title }) => {
  if (!content) return null
  return (
    <>
      <h2 className="text-2xl">{title}:</h2>
      <div
        className={`prose prose-invert ${className ?? ""}`}
        dangerouslySetInnerHTML={{ __html: sanitize(content ?? "") }}
      />
    </>
  )
}
