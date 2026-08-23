import { BookIcon, HashIcon, ImageOffIcon, SearchIcon } from "lucide-react"
import { FC, useRef } from "react"
import { MetadataSeries, Series, SeriesUpdate } from "@thoth/client"
import { GenericEdit } from "@thoth/components/generic/generic-edit.tsx"
import { ManagedInput } from "@thoth/components/input/managed-input"
import { ResponsiveImage } from "@thoth/components/responsive-image"
import { Button } from "@thoth/components/ui/button"
import { useUpdateSeries } from "@thoth/queries/resources"
import { FormContext, useForm } from "../../hooks/form"
import { isUUID, toBase64 } from "../../utils/utils"
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

export const SeriesEdit: FC<{ series: Series }> = ({ series }) => {
  const updateSeries = useUpdateSeries()
  const form = useForm(seriesToUpdate(series), {
    fromForm: {
      primaryWorks: value => (value ? Number(value) : undefined),
      totalBooks: value => (value ? Number(value) : undefined),
    },
  })

  return (
    <GenericEdit
      form={form}
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
  const imageRef = useRef<HTMLInputElement>(null)
  return (
    <>
      <div className="flex flex-col md:flex-row">
        <div className="flex cursor-pointer items-center justify-center pr-2">
          <div className="flex flex-col justify-center">
            {form.fields.cover ? (
              <ResponsiveImage
                className="h-52 min-h-52 w-52 min-w-52 rounded-md"
                src={isUUID(form.fields.cover) ? `/api/stream/images/${form.fields.cover}` : form.fields.cover}
                alt="series"
                onClick={() => imageRef.current && imageRef.current.click()}
              />
            ) : (
              <ImageOffIcon
                className="h-52 w-52 cursor-pointer rounded-md"
                onClick={() => imageRef.current && imageRef.current.click()}
              />
            )}
            <input
              className="hidden"
              ref={imageRef}
              type="file"
              accept="image/*"
              onChange={async () => {
                const file = imageRef.current!.files![0]
                const base64 = await toBase64(file)
                form.setFields({ cover: base64 })
              }}
            />
            <Button
              variant="secondary"
              className="mt-2 self-center"
              onPress={() => imageRef.current && imageRef.current.click()}
            >
              Upload image
            </Button>
          </div>
        </div>
        <div className="grow">
          <ManagedInput className="pt-2" name="title" labelClassName="w-28" label="Title" leftIcon={<SearchIcon />} />
          <ManagedInput
            wrapperClassName="py-2"
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

      <div className="flex flex-col pt-4">
        <HtmlEditor
          className="grow"
          placeholder="Description"
          value={form.fields.description}
          onChange={description => form.setFields({ description })}
        />
      </div>
    </>
  )
}
export default SeriesEdit
