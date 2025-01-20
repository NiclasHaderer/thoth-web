import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react"
import React, { Fragment, useEffect, useState } from "react"
import { MdEdit, MdPerson, MdSearch } from "react-icons/md"
import { AudiobookSelectors } from "../../state/audiobook.selectors"
import { useAudiobookState } from "../../state/audiobook.state"
import { SeriesSearch } from "./series-search"
import { Form, useField, useForm } from "../../hooks/form"
import { DetailedSeriesModel, MetadataSeries, PartialSeriesApiModel, UUID } from "@thoth/client"
import { ColoredButton } from "@thoth/components/colored-button"
import { Dialog, DialogButtons } from "@thoth/components/dialog"
import { ManagedInput } from "@thoth/components/input/managed-input"
import HtmlEditor from "../html-editor"

const mergeMetaIntoSeries = ({ ...series }: PartialSeriesApiModel, _: MetadataSeries): PartialSeriesApiModel => {
  // TODO fix
  return series
}

const toPatchSeries = ({ id: _, ...rest }: DetailedSeriesModel): PartialSeriesApiModel => {
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

export const SeriesEdit: React.FC<{ series: DetailedSeriesModel; seriesId: UUID }> = ({
  series: _seriesProp,
  seriesId,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [series, setSeries] = useState(toPatchSeries(_seriesProp))
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)
  const updateSeries = useAudiobookState(s => s.updateSeries)
  const libraryId = useAudiobookState(AudiobookSelectors.selectedLibraryId)!
  const form = useForm(series)

  useEffect(() => setSeries(toPatchSeries(_seriesProp)), [_seriesProp])

  const closeModal = () => setIsOpen(false)
  const openModal = () => setIsOpen(true)

  return (
    <>
      <ColoredButton color="secondary" onClick={openModal}>
        <MdEdit className="mr-2" /> Edit
      </ColoredButton>
      <Dialog closeModal={closeModal} isOpen={isOpen} dialogClass="min-h-[510px]" title="Edit Series">
        <Form
          form={form}
          onSubmit={async values => {
            await updateSeries({ libraryId, id: seriesId }, values)
            closeModal()
          }}
        >
          <TabGroup selectedIndex={selectedTabIndex} onChange={index => setSelectedTabIndex(index)}>
            <TabList className="p-2-solid w-full rounded-md border-2 border-primary border-opacity-50">
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
            </TabList>
            <TabPanels className="mt-2">
              <TabPanel className="rounded-md border-2 border-primary border-opacity-0 focus:border-opacity-20">
                <SeriesForm />
              </TabPanel>
              <TabPanel>
                <SeriesSearch
                  series={series.title}
                  authors={series.authors}
                  select={seriesMeta => {
                    setSeries(mergeMetaIntoSeries(series, seriesMeta))
                    setSelectedTabIndex(0)
                  }}
                />
              </TabPanel>
            </TabPanels>
          </TabGroup>
          <DialogButtons closeModal={closeModal} />
        </Form>
      </Dialog>
    </>
  )
}

const SeriesForm = () => {
  const { value: descriptionValue, formSetValue: setDescriptionValue } = useField<PartialSeriesApiModel, "description">(
    "description"
  )

  return (
    <>
      <ManagedInput name="title" labelClassName="w-28" label="Title" leftIcon={<MdSearch />} />
      <ManagedInput name="authors" labelClassName="w-28" label="Author" leftIcon={<MdPerson />} />

      <label className="flex items-center">
        <HtmlEditor
          className="h-64 !max-h-64 flex-grow"
          placeholder="Description"
          value={descriptionValue}
          onChange={setDescriptionValue}
        />
      </label>
    </>
  )
}
export default SeriesEdit
