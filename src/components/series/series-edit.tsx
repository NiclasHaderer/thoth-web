import { HashIcon, SearchIcon } from "lucide-react"
import { FC } from "react"
import { MetadataSeries, Series, SeriesUpdate } from "@thoth/client"
import { GenericEdit } from "@thoth/components/generic/generic-edit.tsx"
import { ManagedInput } from "@thoth/components/input/managed-input"
import { useUpdateSeries } from "@thoth/queries/resources"
import { FormContext, useForm } from "../../hooks/form"
import { HtmlEditor } from "../html-editor"
import { SeriesSearch } from "./series-search"

const mergeMetaIntoSeries = ({ ...series }: SeriesUpdate, seriesMetadata: MetadataSeries): SeriesUpdate => {
  series.description = seriesMetadata.description ?? series.description
  series.title = seriesMetadata.title ?? series.title
  series.cover = seriesMetadata.coverURL ?? series.cover
  series.primaryWorks = seriesMetadata.primaryWorks ?? series.primaryWorks
  series.provider = seriesMetadata.id.provider ?? series.provider
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
    books: undefined,
  }
}

export const SeriesEdit: FC<{ series: Series }> = ({ series }) => {
  const updateSeries = useUpdateSeries()
  const form = useForm(seriesToUpdate(series))

  return (
    <GenericEdit
      form={form}
      onSubmit={(values, closeModal) => {
        updateSeries.mutate(
          { libraryId: series.libraryId, id: series.id, data: values },
          { onSuccess: () => closeModal() }
        )
      }}
      title="Edit Series"
      InformationDisplay={() => <SeriesForm form={form} />}
      Search={({ onSelect }) => (
        <SeriesSearch
          libraryId={series.libraryId}
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
      <ManagedInput className="pt-2" name="title" labelClassName="w-28" label="Title" leftIcon={<SearchIcon />} />
      <ManagedInput
        wrapperClassName="py-2"
        name="primaryWorks"
        labelClassName="min-w-28"
        label="Primary Works"
        leftIcon={<HashIcon />}
      />

      <HtmlEditor
        className="grow"
        placeholder="Description"
        value={form.fields.description}
        onChange={description => form.setFields({ description })}
      />
    </>
  )
}
export default SeriesEdit
