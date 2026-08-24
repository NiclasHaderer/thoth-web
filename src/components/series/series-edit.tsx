import { BookIcon, HashIcon, SearchIcon } from "lucide-react"
import { FC } from "react"
import { MetadataSeries, Series, SeriesUpdate } from "@thoth/client"
import { GenericEdit } from "@thoth/components/generic/generic-edit.tsx"
import { CoverPicker } from "@thoth/components/input/cover-picker"
import { ManagedInput } from "@thoth/components/input/managed-input"
import { useUpdateSeries } from "@thoth/queries/resources"
import { FormContext, useForm } from "../../hooks/form"
import { fromFormNumber } from "../../utils/utils"
import { HtmlEditor } from "../html-editor"
import { SeriesSearch } from "./series-search"

const mergeMetaIntoSeries = ({ ...series }: SeriesUpdate, seriesMetadata: MetadataSeries): SeriesUpdate => {
  series.description = seriesMetadata.description ?? series.description
  series.title = seriesMetadata.title ?? series.title
  series.cover = seriesMetadata.coverURL ?? series.cover
  series.primaryWorks = seriesMetadata.primaryWorks ?? series.primaryWorks
  series.totalBooks = seriesMetadata.totalBooks ?? series.totalBooks
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

export const SeriesEdit: FC<{ series: Series; isOpen: boolean; onOpenChange: (open: boolean) => void }> = ({
  series,
  isOpen,
  onOpenChange,
}) => {
  const updateSeries = useUpdateSeries()
  const form = useForm(seriesToUpdate(series), {
    fromForm: {
      primaryWorks: fromFormNumber,
      totalBooks: fromFormNumber,
    },
  })

  return (
    <GenericEdit
      form={form}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onSubmit={async (values, closeModal) => {
        await updateSeries.mutateAsync({ libraryId: series.libraryId, id: series.id, data: values })
        closeModal()
      }}
      title="Edit Series"
      information={<SeriesForm form={form} />}
      search={onSelect => (
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
      <div className="flex flex-col md:flex-row">
        <CoverPicker alt="series" value={form.fields.cover} onChange={cover => form.setFields({ cover })} />
        <div className="min-w-0 grow">
          <ManagedInput name="title" labelClassName="w-28" label="Title" leftIcon={<SearchIcon />} />
          <ManagedInput
            name="primaryWorks"
            type="number"
            min="0"
            labelClassName="w-28"
            label="Primary Works"
            leftIcon={<HashIcon />}
          />
          <ManagedInput
            name="totalBooks"
            type="number"
            min="0"
            labelClassName="w-28"
            label="Total Books"
            leftIcon={<BookIcon />}
          />
        </div>
      </div>

      <HtmlEditor
        placeholder="Description"
        value={form.fields.description}
        onChange={description => form.setFields({ description })}
      />
    </>
  )
}
export default SeriesEdit
