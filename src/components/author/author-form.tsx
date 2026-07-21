import { FC, useRef } from "react"
import { CiSaveUp1 } from "react-icons/ci"
import { MdAddLink, MdCelebration, MdPerson } from "react-icons/md"
import { AuthorUpdate } from "@thoth/client"
import { ManagedInput } from "@thoth/components/input/managed-input"
import { ResponsiveImage } from "@thoth/components/responsive-image"
import { FormContext } from "../../hooks/form"
import { isUUID, toBase64 } from "../../utils/utils"
import { HtmlEditor } from "../html-editor"
import { MdDeceased } from "../icons/deceased"

export const AuthorForm: FC<{ form: FormContext<AuthorUpdate> }> = ({ form }) => {
  const imageInputRef = useRef<HTMLInputElement>(null)
  return (
    <>
      <div className="flex flex-col pb-2 md:flex-row">
        <div className="flex cursor-pointer items-center justify-center pr-2">
          <div className="group relative flex flex-col justify-center">
            {form.fields.image ? (
              <ResponsiveImage
                className="mx-2 mt-2 h-52 min-h-52 w-52 cursor-pointer rounded-full bg-cover"
                src={isUUID(form.fields.image) ? `/api/stream/images/${form.fields.image}` : form.fields.image}
                alt="author"
                onClick={() => imageInputRef.current && imageInputRef.current.click()}
              />
            ) : (
              <MdPerson
                className="m-2 h-52 w-52 cursor-pointer rounded-full"
                onClick={() => imageInputRef.current && imageInputRef.current.click()}
              />
            )}
            <input
              className="hidden"
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={async () => {
                const file = imageInputRef.current!.files![0]
                const base64 = await toBase64(file)
                form.setFields({ image: base64 })
              }}
            />
            <div className="bg-card absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full p-2 opacity-0 transition-all group-hover:opacity-70">
              <CiSaveUp1 className="h-6 w-6" />
            </div>
          </div>
        </div>
        <div>
          <ManagedInput
            wrapperClassName="pt-2"
            name="name"
            labelClassName="w-28"
            label="Name"
            leftIcon={<MdPerson />}
          />
          <ManagedInput
            wrapperClassName="pt-2"
            name="birthDate"
            type="date"
            labelClassName="w-28"
            label="Born"
            leftIcon={<MdCelebration />}
          />
          <ManagedInput
            wrapperClassName="pt-2"
            name="deathDate"
            type="date"
            labelClassName="w-28"
            label="Died"
            leftIcon={<MdDeceased />}
          />
          <ManagedInput
            wrapperClassName="pt-2"
            name="website"
            labelClassName="w-28"
            label="Website"
            leftIcon={<MdAddLink />}
          />
        </div>
      </div>
      <HtmlEditor
        className="grow"
        placeholder="Biography"
        value={form.fields.biography}
        onChange={bio => form.setFields({ biography: bio ?? "" })}
      />
    </>
  )
}
