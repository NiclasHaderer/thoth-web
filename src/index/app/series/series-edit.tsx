import { Tab } from "@headlessui/react"
import React, { Fragment, useEffect, useState } from "react"
import { MdEdit, MdPerson, MdSearch } from "react-icons/md"
import { PatchSeries, SeriesModelWithBooks } from "../../models/api"
import { AudiobookSelectors } from "../../state/audiobook.selectors"
import { useAudiobookState } from "../../state/audiobook.state"
import { ColoredButton } from "../common/colored-button"
import { Dialog } from "../common/dialog"
import { FormikInput } from "../common/formik-input"
import { SeriesSearch } from "./series-search"
import { MetadataSeries } from "../../models/metadata"
import { useField } from "formik"

const HtmlEditor = React.lazy(() => import("../common/editor"))

const mergeMetaIntoSeries = ({ ...series }: PatchSeries, meta: MetadataSeries): PatchSeries => {
  // TODO fix
  return series
}

const toPatchSeries = ({ id, ...rest }: SeriesModelWithBooks): PatchSeries => {
  return {
    authors: rest.authors.flatMap(author => [author.id, author.id]),
    cover: rest.coverID,
    description: rest.description,
    title: rest.title,
    books: rest.books.map(book => book.id),
    primaryWorks: rest.primaryWorks,
    provider: rest.provider,
    providerID: rest.providerID,
    totalBooks: rest.totalBooks,
  }
}

export const SeriesEdit: React.VFC<{ series: SeriesModelWithBooks }> = ({ series: _seriesProp }) => {
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
                  authors={series.authors}
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
      <FormikInput name="authors" labelClassName="w-28" label="Author" icon={<MdPerson />} />

      <label className="flex items-center">
        <React.Suspense fallback={<div />}>
          <HtmlEditor
            className="h-64 !max-h-64 flex-grow"
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
