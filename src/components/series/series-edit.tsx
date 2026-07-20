import { FC } from "react"
import { MdNumbers, MdSearch } from "react-icons/md"
import { MetadataSeries, Series, SeriesUpdate } from "@thoth/client"
import { GenericEdit } from "@thoth/components/generic/generic-edit.tsx"
import { ManagedInput } from "@thoth/components/input/managed-input"
import { FormContext, useForm } from "../../hooks/form"
import { useAudiobookState } from "../../state/audiobook.state"
import { HtmlEditor } from "../html-editor"
import { SeriesSearch } from "./series-search"

const mergeMetaIntoSeries = ({ ...series }: SeriesUpdate, seriesMetadata: MetadataSeries): SeriesUpdate => {
  series.description = seriesMetadata.description ?? series.description
  series.title = seriesMetadata.description ?? series.title
  series.cover = seriesMetadata.coverURL ?? series.cover
  series.primaryWorks = seriesMetadata.primaryWorks ?? series.primaryWorks
  series.provider = seriesMetadata.id.provider ?? series.providerID
  series.providerID = seriesMetadata.id.itemID ?? series.providerID
  return series
}

const seriesToUpdate = (series: Series): SeriesUpdate => {
  return {
    cover: series.coverID,
    description: series.description,
    primaryWorks: series.primaryWorks,
    provider: series.provider,
    providerID: series.providerID,
    title: series.title,
    totalBooks: series.totalBooks,
    authors: undefined,
    books: undefined,
  }
}

export const SeriesEdit: FC<{ series: Series }> = ({ series }) => {
  const updateSeries = useAudiobookState(s => s.updateSeries)
  const form = useForm(seriesToUpdate(series))

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
          libraryId={series.library.id}
          series={form.fields.title}
          authors={series.authors.map(a => a.name)}
          onSelect={seriesMeta => {
            form.setAllFields(mergeMetaIntoSeries(form.fields, seriesMeta))
            onSelect()
          }}
        />
      )}
    />
  )
}

const SeriesForm: FC<{ form: FormContext<SeriesUpdate> }> = ({ form }) => {
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
