import React, { useRef } from "react"
import { isUUID, toBase64 } from "../../utils/utils"
import { MdAddLink, MdCelebration, MdPerson } from "react-icons/md"
import { MdDeceased } from "../icons/deceased"
import { useField } from "../../hooks/form"
import { ResponsiveImage } from "@thoth/components/responsive-image"
import { ColoredButton } from "@thoth/components/colored-button"
import { ManagedInput } from "@thoth/components/input/managed-input"
import HtmlEditor from "../html-editor"
import { PartialAuthorApiModel } from "@thoth/client"

export const AuthorForm = () => {
  const imageInputRef = useRef<HTMLInputElement>(null)

  const { value: descriptionValue, formSetValue: setDescriptionValue } = useField(
    "biography" satisfies keyof PartialAuthorApiModel
  )
  const { value: imageValue, formSetValue: setImageValue } = useField("image" satisfies keyof PartialAuthorApiModel)

  return (
    <>
      <div className="flex flex-col md:flex-row">
        <div className="flex cursor-pointer items-center justify-center pr-2">
          <div className="flex flex-col justify-center">
            {imageValue ? (
              <ResponsiveImage
                className="h-52 min-h-52 w-52 cursor-pointer rounded-full bg-cover"
                src={isUUID(imageValue) ? `/api/image/${imageValue}` : imageValue}
                alt="author"
                onClick={() => imageInputRef.current && imageInputRef.current.click()}
              />
            ) : (
              <MdPerson
                className="h-52 w-52 cursor-pointer rounded-full"
                onClick={() => imageInputRef.current && imageInputRef.current.click()}
              />
            )}
            <input
              className="hidden"
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={async () => {
                const file = await imageInputRef.current!.files![0]
                const base64 = await toBase64(file)
                setImageValue(base64)
              }}
            />
            <ColoredButton
              color="secondary"
              className="my-2 self-center"
              onClick={() => imageInputRef.current && imageInputRef.current.click()}
            >
              Upload image
            </ColoredButton>
          </div>
        </div>
        <div>
          <ManagedInput name="name" labelClassName="w-28" label="Name" leftIcon={<MdPerson />} />
          <ManagedInput name="birthDate" type="date" labelClassName="w-28" label="Born" leftIcon={<MdCelebration />} />
          <ManagedInput name="deathDate" type="date" labelClassName="w-28" label="Died" leftIcon={<MdDeceased />} />
          <ManagedInput name="website" labelClassName="w-28" label="Website" leftIcon={<MdAddLink />} />
        </div>
      </div>
      <label className="flex items-center">
        <HtmlEditor
          className="flex-grow"
          placeholder="Description"
          value={descriptionValue}
          onChange={setDescriptionValue}
        />
      </label>
    </>
  )
}
