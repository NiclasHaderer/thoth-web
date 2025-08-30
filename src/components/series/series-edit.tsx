import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react"
import { FC, Fragment, useState } from "react"
import { MdEdit, MdNumbers, MdSearch } from "react-icons/md"
import { DetailedSeriesModel, MetadataSeries, PartialSeriesApiModel } from "@thoth/client"
import { ColoredButton } from "@thoth/components/colored-button"
import { Dialog, DialogActions, DialogBody, DialogButtons } from "@thoth/components/dialog"
import { ManagedInput } from "@thoth/components/input/managed-input"
import { Form, FormContext, useForm } from "../../hooks/form"
import { useAudiobookState } from "../../state/audiobook.state"
import { HtmlEditor } from "../html-editor"
import { SeriesSearch } from "./series-search"

type SeriesForm = Pick<
  PartialSeriesApiModel,
  "title" | "description" | "provider" | "providerID" | "primaryWorks" | "cover"
>

const mergeMetaIntoSeries = ({ ...seriesModel }: SeriesForm, seriesMetadata: MetadataSeries): SeriesForm => {
  seriesModel.description = seriesMetadata.description ?? seriesModel.description
  seriesModel.title = seriesMetadata.description ?? seriesModel.title
  seriesModel.cover = seriesMetadata.coverURL ?? seriesModel.cover
  seriesModel.primaryWorks = seriesMetadata.primaryWorks ?? seriesModel.primaryWorks
  seriesModel.provider = seriesMetadata.id.provider ?? seriesModel.providerID
  seriesModel.providerID = seriesMetadata.id.itemID ?? seriesModel.providerID
  return seriesModel
}

const toSeriesForm = ({ id: _, ...rest }: DetailedSeriesModel): SeriesForm => {
  return {
    cover: rest.coverID,
    description: rest.description,
    title: rest.title,
    primaryWorks: rest.primaryWorks,
    provider: rest.provider,
    providerID: rest.providerID,
  }
}

export const SeriesEdit: FC<{ series: DetailedSeriesModel }> = ({ series }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)
  const updateSeries = useAudiobookState(s => s.updateSeries)
  const form = useForm(toSeriesForm(series))

  const closeModal = () => setIsOpen(false)
  const openModal = () => setIsOpen(true)

  return (
    <>
      <ColoredButton color="secondary" onClick={openModal}>
        <MdEdit className="mr-2" /> Edit
      </ColoredButton>
      <Dialog closeModal={closeModal} isOpen={isOpen} dialogClass="min-h-[510px]" title="Edit Series">
        <DialogBody>
          <Form
            form={form}
            onSubmit={async values => {
              updateSeries({ libraryId: series.library.id, id: series.id }, values)
              closeModal()
            }}
          >
            <TabGroup selectedIndex={selectedTabIndex} onChange={index => setSelectedTabIndex(index)}>
              <TabList className="p-2-solid w-full">
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={`w-1/2 rounded-l-md p-2 transition-colors focus:bg-active ${selected ? "bg-active-light" : ""}`}
                    >
                      Tags
                    </button>
                  )}
                </Tab>
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={`w-1/2 rounded-r-md p-2 transition-colors focus:bg-active ${
                        selected ? "bg-active-light" : ""
                      }`}
                    >
                      Lookup information
                    </button>
                  )}
                </Tab>
              </TabList>
              <TabPanels className="mt-2">
                <TabPanel tabIndex={-1}>
                  <SeriesForm form={form} />
                </TabPanel>
                <TabPanel tabIndex={-1}>
                  <SeriesSearch
                    series={form.fields.title}
                    authors={series.authors.map(a => a.name)}
                    select={seriesMeta => {
                      form.setAllFields(mergeMetaIntoSeries(form.fields, seriesMeta))
                      setSelectedTabIndex(0)
                    }}
                  />
                </TabPanel>
              </TabPanels>
            </TabGroup>
            <DialogActions>
              <DialogButtons closeModal={closeModal} />
            </DialogActions>
          </Form>
        </DialogBody>
      </Dialog>
    </>
  )
}

const SeriesForm: FC<{ form: FormContext<SeriesForm> }> = ({ form }) => {
  return (
    <>
      <ManagedInput className="pt-2" name="title" labelClassName="w-28" label="Title" leftIcon={<MdSearch />} />
      <ManagedInput
        wrapperClassName="py-2"
        name="primaryWorks"
        labelClassName="min-w-28"
        label="Primary Works"
        leftIcon={<MdNumbers />}
      />

      <HtmlEditor
        className="flex-grow"
        placeholder="Description"
        value={form.fields.description}
        onChange={description => form.setFields({ description })}
      />
    </>
  )
}
export default SeriesEdit
