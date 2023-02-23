import { Tab } from "@headlessui/react"
import React, { Fragment, useEffect, useRef, useState } from "react"
import { MdAddLink, MdCelebration, MdEdit, MdPerson } from "react-icons/md"
import { AuthorModel, NamedId, PatchAuthor, TitledId } from "../../models/api"
import { AudiobookSelectors } from "../../state/audiobook.selectors"
import { useAudiobookState } from "../../state/audiobook.state"
import { ColoredButton } from "../common/colored-button"
import { Dialog } from "../common/dialog"
import { FormikInput } from "../common/formik-input"
import { AuthorSearch } from "./author-search"
import { MetadataAuthor } from "../../models/metadata"
import { useField } from "formik"
import { isUUID, toBase64 } from "../../helpers"
import { ResponsiveImage } from "../common/responsive-image"
import { environment } from "../../env"
import { MdDeceased } from "../icons/deceased"

const HtmlEditor = React.lazy(() => import("../common/editor"))

type EditAuthor = PatchAuthor

const mergeMetaIntoAuthor = ({ ...author }: EditAuthor, meta: MetadataAuthor): PatchAuthor => {
  author.biography = meta.biography || author.biography
  author.birthDate = meta.birthDate || author.birthDate
  author.bornIn = meta.bornIn || author.bornIn
  author.deathDate = meta.deathDate || author.deathDate
  author.image = meta.imageURL || author.image
  author.name = meta.name || author.name
  // TODO provider
  author.provider = author.provider
  author.website = meta.website || author.website
  return author
}

const toEditAuthor = ({ id, imageID, ...rest }: AuthorModel): EditAuthor => {
  return {
    ...rest,
    image: imageID,
  }
}

export const AuthorEdit: React.VFC<{ author: AuthorModel }> = ({ author: _authorProp }) => {
  let [isOpen, setIsOpen] = useState(false)
  const [author, setAuthor] = useState(toEditAuthor(_authorProp))
  const updateAuthor = useAudiobookState(AudiobookSelectors.updateAuthor)
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)

  useEffect(() => setAuthor(toEditAuthor(_authorProp)), [_authorProp])

  const closeModal = () => setIsOpen(false)
  const openModal = () => setIsOpen(true)

  return (
    <>
      <ColoredButton color="secondary" onClick={openModal}>
        <MdEdit className="mr-2" /> Edit
      </ColoredButton>
      <Dialog
        closeModal={closeModal}
        isOpen={isOpen}
        dialogClass="min-h-[510px]"
        title="Edit Author"
        buttons={
          <>
            <ColoredButton type="submit">Submit</ColoredButton>
            <ColoredButton type="button" color="secondary" onClick={closeModal}>
              Cancel
            </ColoredButton>
          </>
        }
        values={author}
        onSubmit={values => {
          updateAuthor({ ...values, id: _authorProp.id })
          closeModal()
        }}
      >
        <>
          <Tab.Group selectedIndex={selectedTabIndex} onChange={index => setSelectedTabIndex(index)}>
            <Tab.List className="p-2-solid w-full rounded-md border-2 border-primary border-opacity-50">
              <Tab as={Fragment}>
                {({ selected }) => (
                  <button
                    className={`w-1/2 p-2 transition-colors focus:bg-active ${selected ? "bg-active-light" : ""}`}
                  >
                    Tags
                  </button>
                )}
              </Tab>
              <Tab as={Fragment}>
                {({ selected }) => (
                  <button
                    className={`w-1/2 border-l-2 border-primary border-opacity-50 p-2 transition-colors focus:bg-active ${
                      selected ? "bg-active-light" : ""
                    }`}
                  >
                    Lookup information
                  </button>
                )}
              </Tab>
            </Tab.List>
            <Tab.Panels className="mt-2">
              <Tab.Panel className="rounded-md border-2 border-primary border-opacity-0 focus:border-opacity-20">
                <AuthorForm />
              </Tab.Panel>
              <Tab.Panel>
                <AuthorSearch
                  author={author.name}
                  select={authorMeta => {
                    setAuthor(mergeMetaIntoAuthor(author, authorMeta))
                    setSelectedTabIndex(0)
                  }}
                />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </>
      </Dialog>
    </>
  )
}

const AuthorForm = () => {
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
export default AuthorEdit
