import { PatchAuthor } from "../../models/api"
import React, { useRef } from "react"
import { ResponsiveImage } from "../common/responsive-image"
import { isUUID, toBase64 } from "../../utils"
import { environment } from "../../env"
import { MdAddLink, MdCelebration, MdPerson } from "react-icons/md"
import { ColoredButton } from "../common/colored-button"
import { ManagedInput } from "../common/managed-input"
import { MdDeceased } from "../icons/deceased"
import { useField } from "../../hooks/form"
import HtmlEditor from "../common/editor"

export const AuthorForm = () => {
  const descriptionAccessor: keyof PatchAuthor = "biography"
  const imageAccessor: keyof PatchAuthor = "image"

  const imageInputRef = useRef<HTMLInputElement>(null)

  const { value: descriptionValue, formSetValue: setDescriptionValue } = useField(descriptionAccessor)
  const { value: imageValue, formSetValue: setImageValue } = useField(imageAccessor)

  return (
    <>
      <div className="flex flex-col md:flex-row">
        <div className="flex cursor-pointer items-center justify-center pr-2">
          <div className="flex flex-col justify-center">
            {imageValue ? (
              <ResponsiveImage
                className="h-52 min-h-52 w-52 cursor-pointer rounded-full bg-cover"
                src={isUUID(imageValue) ? `${environment.apiURL}/image/${imageValue}` : imageValue}
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
          <ManagedInput name="name" labelClassName="w-28" label="Name" icon={<MdPerson />} />
          <ManagedInput name="birthDate" type="date" labelClassName="w-28" label="Born" icon={<MdCelebration />} />
          <ManagedInput name="deathDate" type="date" labelClassName="w-28" label="Died" icon={<MdDeceased />} />
          <ManagedInput name="website" labelClassName="w-28" label="Website" icon={<MdAddLink />} />
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
