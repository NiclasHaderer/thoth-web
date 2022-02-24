import { Content, EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import React, { useEffect } from "react"
import { TextAlign } from "@tiptap/extension-text-align"
import { Placeholder } from "@tiptap/extension-placeholder"
import "./HtmlEditor.scss"

const HtmlEditor: React.VFC<{
  value?: Content
  placeholder?: string
  className?: string | undefined
  onChange?: (newValue: string | null) => void
}> = ({ value, className, onChange, placeholder = "..." }) => {
  const editor = useEditor({
    extensions: [StarterKit, TextAlign, Placeholder.configure({ placeholder })],
    content: value,
  })

  useEffect(() => {
    if (!editor) return

    const callUpdateFunction = () => {
      if (!onChange) return

      if (editor.isEmpty) {
        onChange(null)
      } else {
        onChange(editor.getHTML())
      }
    }
    editor.on("update", callUpdateFunction)
    return () => {
      editor.off("update", callUpdateFunction)
    }
  }, [editor, onChange])

  return (
    <EditorContent
      editor={editor}
      onChange={() => onChange && onChange(editor!.getHTML())}
      className={`prose prose-invert max-h-36 max-w-none cursor-auto overflow-y-auto rounded-md bg-elevate p-2 ${
        className ?? ""
      }`}
    />
  )
}

export default HtmlEditor
