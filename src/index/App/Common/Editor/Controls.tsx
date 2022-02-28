import React from "react"
import { Editor } from "@tiptap/react"
import { Select } from "../Select"
import {
  MdFormatBold,
  MdFormatItalic,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatUnderlined,
} from "react-icons/md"

const TextStyle: React.VFC<{ editor: Editor }> = ({ editor }) => {
  const textStyleOptions = [
    { value: "Paragraph" },
    { value: "Heading 1" },
    { value: "Heading 2" },
    { value: "Heading 3" },
  ] as const

  const applyTextStyle = (value: typeof textStyleOptions[number]["value"]) => {
    switch (value) {
      case "Paragraph":
        editor.chain().focus().setParagraph().run()
        break
      case "Heading 1":
        editor.chain().focus().setHeading({ level: 1 }).run()
        break
      case "Heading 2":
        editor.chain().focus().setHeading({ level: 2 }).run()
        break
      case "Heading 3":
        editor.chain().focus().setHeading({ level: 3 }).run()
        break
    }
  }

  const getSelectedTextStyle = (): typeof textStyleOptions[number]["value"] => {
    const headingAttributes = editor.getAttributes("heading")
    if (headingAttributes.level) {
      if (headingAttributes.level === 1) {
        return "Heading 1"
      } else if (headingAttributes.level === 2) {
        return "Heading 2"
      } else if (headingAttributes.level === 3) {
        return "Heading 3"
      }
    }
    return "Paragraph"
  }

  return (
    <Select
      vDir={"top"}
      options={textStyleOptions}
      title="Text style"
      value={getSelectedTextStyle()}
      onChange={value => applyTextStyle(value)}
    />
  )
}

export const EditorControls: React.VFC<{ editor: Editor | null }> = ({ editor }) => {
  if (!editor) return null

  return (
    <div className="flex items-center px-2">
      {/* Has to stay here to prevent autofocus issues */}
      <button type="button" className="hidden" />
      <TextStyle editor={editor} />

      <button
        type="button"
        className={`m-1 h-6 w-6 cursor-pointer rounded focus:bg-light-active ${
          editor && editor.isActive("italic") ? "bg-active" : ""
        }`}
      >
        <MdFormatItalic
          className="h-full w-full"
          onClick={() => {
            if (!editor) return
            editor.chain().focus().toggleItalic().run()
          }}
        />
      </button>
      <button
        type="button"
        className={`m-1 h-6 w-6 cursor-pointer rounded focus:bg-light-active ${
          editor && editor.isActive("bold") ? "bg-active" : ""
        }`}
      >
        <MdFormatBold
          className="h-full w-full"
          onClick={() => {
            if (!editor) return
            editor.chain().focus().toggleBold().run()
          }}
        />
      </button>
      <button
        type="button"
        className={`m-1 h-6 w-6 cursor-pointer rounded focus:bg-light-active ${
          editor && editor.isActive("underline") ? "bg-active" : ""
        }`}
      >
        <MdFormatUnderlined
          className="h-full w-full"
          onClick={() => {
            if (!editor) return
            editor.chain().focus().toggleUnderline().run()
          }}
        />
      </button>
      <button
        type="button"
        className={`m-1 h-6 w-6 cursor-pointer rounded focus:bg-light-active ${
          editor && editor.isActive("orderedList") ? "bg-active" : ""
        }`}
      >
        <MdFormatListNumbered
          className="h-full w-full"
          onClick={() => {
            if (!editor) return
            editor.chain().focus().toggleOrderedList().run()
          }}
        />
      </button>
      <button
        type="button"
        className={`m-1 h-6 w-6 cursor-pointer rounded focus:bg-light-active ${
          editor && editor.isActive("bulletList") ? "bg-active" : ""
        }`}
      >
        <MdFormatListBulleted
          className="h-full w-full"
          onClick={() => {
            if (!editor) return
            editor.chain().focus().toggleBulletList().run()
          }}
        />
      </button>
    </div>
  )
}
