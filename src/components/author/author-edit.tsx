import { FC } from "react"
import { Author, AuthorUpdate, MetadataAuthor } from "@thoth/client"
import { GenericEdit } from "@thoth/components/generic/generic-edit.tsx"
import { useUpdateAuthor } from "@thoth/queries/resources"
import { useForm } from "../../hooks/form"
import { fromFormDate, toFormDate } from "../../utils/utils"
import { AuthorForm } from "./author-form"
import { AuthorSearch } from "./author-search"

const mergeMetaIntoAuthor = ({ ...author }: AuthorUpdate, meta: MetadataAuthor): AuthorUpdate => {
  author.biography = meta.biography || author.biography
  author.birthDate = meta.birthDate || author.birthDate
  author.deathDate = meta.deathDate || author.deathDate
  author.bornIn = meta.bornIn || author.bornIn
  author.image = meta.imageURL || author.image
  author.name = meta.name || author.name
  author.provider = meta.id.provider
  author.providerID = meta.id.itemID
  author.website = meta.website || author.website
  return author
}

const authorToUpdateModel = (author: Author): AuthorUpdate => {
  return {
    biography: author.biography,
    birthDate: author.birthDate,
    books: undefined,
    bornIn: author.bornIn,
    deathDate: author.deathDate,
    image: author.imageID,
    name: author.name,
    provider: author.provider,
    providerID: author.providerID,
    website: author.website,
  }
}

export const AuthorEdit: FC<{ author: Author; isOpen: boolean; onOpenChange: (open: boolean) => void }> = ({
  author,
  isOpen,
  onOpenChange,
}) => {
  const updateAuthor = useUpdateAuthor()
  const form = useForm(authorToUpdateModel(author), {
    toForm: {
      birthDate: value => value && toFormDate(value),
      deathDate: value => value && toFormDate(value),
    },
    fromForm: {
      birthDate: value => fromFormDate(value) ?? undefined,
      deathDate: value => fromFormDate(value) ?? undefined,
    },
  })

  return (
    <GenericEdit
      title="Edit Author"
      form={form}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onSubmit={async (values, closeModal) => {
        await updateAuthor.mutateAsync({ libraryId: author.libraryId, id: author.id, data: values })
        closeModal()
      }}
      information={<AuthorForm form={form} />}
      search={onSelect => (
        <AuthorSearch
          libraryId={author.libraryId}
          authorSearch={form.fields.name}
          onSelect={authorMeta => {
            form.setAllFields(mergeMetaIntoAuthor(form.fields, authorMeta))
            onSelect()
          }}
        />
      )}
    />
  )
}

export default AuthorEdit
