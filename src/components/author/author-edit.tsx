import { FC } from "react"
import { Author, AuthorUpdate, MetadataAuthor } from "@thoth/client"
import { GenericEdit } from "@thoth/components/generic/generic-edit.tsx"
import { useForm } from "../../hooks/form"
import { useAudiobookState } from "../../state/audiobook.state"
import { toFormDate } from "../../utils/utils"
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
    bornIn: author.bornIn,
    deathDate: author.deathDate,
    image: author.imageID,
    name: author.name,
    provider: author.provider,
    providerID: author.providerID,
    website: author.website,
  }
}

export const AuthorEdit: FC<{ author: Author }> = ({ author }) => {
  const updateAuthor = useAudiobookState(s => s.updateAuthor)
  const form = useForm(authorToUpdateModel(author), {
    toForm: {
      birthDate: value => value && toFormDate(value),
      deathDate: value => value && toFormDate(value),
    },
  })

  return (
    <GenericEdit
      title="Edit Author"
      form={form}
      onSubmit={async (values, closeModal) => {
        await updateAuthor({ libraryId: author.library.id, id: author.id }, values)
        closeModal()
      }}
      InformationDisplay={() => <AuthorForm form={form} />}
      Search={({ onSelect }) => (
        <AuthorSearch
          libraryId={author.library.id}
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
