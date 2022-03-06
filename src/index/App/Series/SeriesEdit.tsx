import { Tab } from "@headlessui/react"
import React, { Fragment, useEffect, useState } from "react"
import { MdEdit, MdPerson, MdSearch } from "react-icons/md"
import { PatchSeries, SeriesModel } from "../../API/models/Audiobook"
import { AudiobookSelectors } from "../../State/Audiobook.Selectors"
import { useAudiobookState } from "../../State/Audiobook.State"
import { ColoredButton } from "../Common/ColoredButton"
import { Dialog } from "../Common/Dialog"
import { FormikInput } from "../Common/Input"
import { SeriesSearch } from "./SeriesSearch"
import { SeriesMetadata } from "../../API/models/Metadat"
import { useField } from "formik"

const HtmlEditor = React.lazy(() => import("../Common/Editor"))

const mergeMetaIntoSeries = ({ ...series }: PatchSeries, meta: SeriesMetadata): PatchSeries => {
  series.title = meta.name || series.title
  series.author = meta.author || series.author
  series.description = meta.description || series.description
  series.providerID = meta.id || series.providerID
  return series
}

const toPatchSeries = ({ id, author, ...rest }: SeriesModel): PatchSeries => ({
  ...rest,
  author: author.name,
})

export const SeriesEdit: React.VFC<{ series: SeriesModel }> = ({ series: _seriesProp }) => {
  let [isOpen, setIsOpen] = useState(false)
  const [series, setSeries] = useState(toPatchSeries(_seriesProp))
  const updateSeries = useAudiobookState(AudiobookSelectors.updateSeries)
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)

  useEffect(() => setSeries(toPatchSeries(_seriesProp)), [_seriesProp])

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
        title="Edit Series"
        buttons={
          <>
            <ColoredButton type="submit">Submit</ColoredButton>
            <ColoredButton type="button" color="secondary" onClick={closeModal}>
              Cancel
            </ColoredButton>
          </>
        }
        values={series}
        onSubmit={values => {
          updateSeries({ ...values, id: _seriesProp.id })
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
                <SeriesForm />
              </Tab.Panel>
              <Tab.Panel>
                <SeriesSearch
                  series={series.title}
                  author={series.author}
                  select={seriesMeta => {
                    setSeries(mergeMetaIntoSeries(series, seriesMeta))
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

const SeriesForm = () => {
  const descriptionAccessor: keyof PatchSeries = "description"

  const [description, , descriptionHelpers] = useField(descriptionAccessor)

  return (
    <>
      <FormikInput name="title" labelClassName="w-28" label="Title" icon={<MdSearch />} />
      <FormikInput name="author" labelClassName="w-28" label="Author" icon={<MdPerson />} />

      <label className="flex items-center">
        <React.Suspense fallback={<div />}>
          <HtmlEditor
            className="!max-h-64 flex-grow"
            placeholder="Description"
            value={description.value}
            onChange={descriptionHelpers.setValue}
          />
        </React.Suspense>
      </label>
    </>
  )
}
export default SeriesEdit
