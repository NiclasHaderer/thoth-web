import { PatchAuthor } from "../../models/api"
import React, { useRef } from "react"
import { useField } from "formik"
import { ResponsiveImage } from "../common/responsive-image"
import { isUUID, toBase64 } from "../../utils"
import { environment } from "../../env"
import { MdAddLink, MdCelebration, MdPerson } from "react-icons/md"
import { ColoredButton } from "../common/colored-button"
import { FormikInput } from "../common/formik-input"
import { MdDeceased } from "../icons/deceased"

const HtmlEditor = React.lazy(() => import("../common/editor"))

export const AuthorForm = () => {
  const descriptionAccessor: keyof PatchAuthor = "biography"
  const imageAccessor: keyof PatchAuthor = "image"

  const imageInputRef = useRef<HTMLInputElement>(null)

  const [description, , descriptionHelpers] = useField(descriptionAccessor)
  const [image, , imageHelpers] = useField(imageAccessor)

  return (
    <>
      <div className="flex flex-col md:flex-row">
        <div className="flex cursor-pointer items-center justify-center pr-2">
          <div className="flex flex-col justify-center">
            {image.value ? (
              <ResponsiveImage
                className="h-52 min-h-52 w-52 cursor-pointer rounded-full bg-cover"
                src={isUUID(image.value) ? `${environment.apiURL}/image/${image.value}` : image.value}
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
                imageHelpers.setValue(base64)
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
          <FormikInput name="name" labelClassName="w-28" label="Name" icon={<MdPerson />} />
          <FormikInput name="birthDate" type="date" labelClassName="w-28" label="Birth" icon={<MdCelebration />} />
          <FormikInput name="deathDate" type="date" labelClassName="w-28" label="Death" icon={<MdDeceased />} />
          <FormikInput name="website" labelClassName="w-28" label="Website" icon={<MdAddLink />} />
        </div>
      </div>
      <label className="flex items-center">
        <React.Suspense fallback={<div />}>
          <HtmlEditor
            className="flex-grow"
            placeholder="Description"
            value={description.value}
            onChange={descriptionHelpers.setValue}
          />
        </React.Suspense>
      </label>
    </>
  )
}