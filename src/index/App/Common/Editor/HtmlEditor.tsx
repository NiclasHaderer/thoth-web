import { Content, EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import React from "react"
import { TextAlign } from "@tiptap/extension-text-align"
import { Placeholder } from "@tiptap/extension-placeholder"
import { Underline } from "@tiptap/extension-underline"
import "../HtmlEditor.scss"
import { EditorControls } from "./Controls"

export const HtmlEditor: React.VFC<{
  value?: Content
  placeholder?: string
  className?: string | undefined
  onChange?: (newValue: string | null) => void
}> = ({ value, className, onChange, placeholder = "..." }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      TextAlign,
      Underline,
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    autofocus: false,
  })

  return (
    <div className="flex flex-grow flex-col rounded-md border border-active">
      <EditorControls editor={editor} />
      <EditorContent
        editor={editor}
        onChange={() => {
          if (!editor || !onChange) return
          editor.isEmpty ? onChange(null) : onChange(editor.getHTML())
        }}
        className={`prose prose-invert max-h-36 max-w-none cursor-auto overflow-y-auto rounded-b-md bg-elevate p-2 ${
          className ?? ""
        }`}
      />
    </div>
  )
}
