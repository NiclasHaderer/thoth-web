import { FC } from "react"
import { MdNumbers, MdSearch } from "react-icons/md"
import { DetailedSeriesModel, MetadataSeries, PartialSeriesApiModel } from "@thoth/client"
import { GenericEdit } from "@thoth/components/generic/generic-edit.tsx"
import { ManagedInput } from "@thoth/components/input/managed-input"
import { FormContext, useForm } from "../../hooks/form"
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
  const updateSeries = useAudiobookState(s => s.updateSeries)
  const form = useForm(toSeriesForm(series))

  return (
    <GenericEdit
      form={form}
      onSubmit={async (values, closeModal) => {
        updateSeries({ libraryId: series.library.id, id: series.id }, values)
        closeModal()
      }}
      title="Edit Series"
      InformationDisplay={() => <SeriesForm form={form} />}
      Search={({ onSelect }) => (
        <SeriesSearch
          series={form.fields.title}
          authors={series.authors.map(a => a.name)}
          select={seriesMeta => {
            form.setAllFields(mergeMetaIntoSeries(form.fields, seriesMeta))
            onSelect()
          }}
        />
      )}
    />
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
