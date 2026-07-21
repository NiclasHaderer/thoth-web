import Bold from "@tiptap/extension-bold"
import { Document } from "@tiptap/extension-document"
import Heading from "@tiptap/extension-heading"
import Italic from "@tiptap/extension-italic"
import Paragraph from "@tiptap/extension-paragraph"
import { Placeholder } from "@tiptap/extension-placeholder"
import Text from "@tiptap/extension-text"
import { TextAlign } from "@tiptap/extension-text-align"
import { Underline } from "@tiptap/extension-underline"
import { Content, EditorContent, useEditor } from "@tiptap/react"
import { FC, useEffect } from "react"
import "./_html-editor.css"

export const HtmlEditorImpl: FC<{
  value?: Content
  placeholder?: string
  className?: string | undefined
  onChange?: (newValue: string | undefined) => void
}> = ({ value, className, onChange, placeholder = "..." }) => {
  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Bold,
      Italic,
      Underline,
      TextAlign,
      Heading.configure({ levels: [1, 2, 3] }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    autofocus: false,
  })

  useEffect(() => {
    const update = () => {
      if (!editor || !onChange) return
      editor.isEmpty ? onChange(undefined) : onChange(editor.getHTML())
    }
    editor?.on("update", update)
    return () => {
      editor?.off("update", update)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor])

  return (
    <div className="border-accent flex grow flex-col rounded-md border">
      <button type="button" className="hidden" />
      <EditorContent
        editor={editor}
        className={`prose prose-invert max-h-36 max-w-none cursor-auto overflow-y-auto rounded-b-md p-2 ${
          className ?? ""
        }`}
      />
    </div>
  )
}
