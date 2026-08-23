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
import { FC, useEffect, useRef } from "react"
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

  const lastEmitted = useRef<string | undefined>(undefined)

  useEffect(() => {
    if (!editor || !editor.isInitialized) return
    if (value != null && typeof value !== "string") return
    const normalized = value || undefined
    if (normalized === lastEmitted.current) return
    const current = editor.isEmpty ? undefined : editor.getHTML()
    if (normalized !== current) editor.commands.setContent(value ?? "")
  }, [editor, value])

  useEffect(() => {
    const update = () => {
      if (!editor) return
      lastEmitted.current = editor.isEmpty ? undefined : editor.getHTML()
      onChange?.(lastEmitted.current)
    }
    editor?.on("update", update)
    return () => {
      editor?.off("update", update)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor])

  return (
    <div className="border-input focus-within:border-ring focus-within:ring-ring/50 dark:bg-input/30 mb-4 flex grow flex-col overflow-hidden rounded-lg border transition-colors focus-within:ring-3">
      <button type="button" className="hidden" />
      <EditorContent
        editor={editor}
        className={`prose prose-invert max-h-36 max-w-none cursor-auto overflow-y-auto p-2 [&_.ProseMirror]:outline-none ${
          className ?? ""
        }`}
      />
    </div>
  )
}
