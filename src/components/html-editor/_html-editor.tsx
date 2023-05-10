import { Content, EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import React, { FC, useEffect } from "react"
import { TextAlign } from "@tiptap/extension-text-align"
import { Placeholder } from "@tiptap/extension-placeholder"
import { Underline } from "@tiptap/extension-underline"
import "./html-editor.scss"
import { EditorControls } from "./controls"

export const _HtmlEditor: FC<{
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

  useEffect(() => {
    editor?.commands?.setContent(value ?? "")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  useEffect(() => {
    const update = () => {
      if (!editor || !onChange) return
      editor.isEmpty ? onChange(null) : onChange(editor.getHTML())
    }
    editor?.on("update", update)
    return () => {
      editor?.off("update", update)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor])

  return (
    <div className="flex flex-grow flex-col rounded-md border border-active">
      <EditorControls editor={editor} />
      <EditorContent
        editor={editor}
        className={`prose prose-invert max-h-36 max-w-none cursor-auto overflow-y-auto rounded-b-md bg-elevate p-2 ${
          className ?? ""
        }`}
      />
    </div>
  )
}

export default _HtmlEditor
