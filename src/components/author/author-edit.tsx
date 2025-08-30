import { FC } from "react"
import { AuthorApiModel, MetadataAuthor, UUID } from "@thoth/client"
import { GenericEdit } from "@thoth/components/generic/generic-edit.tsx"
import { useForm } from "../../hooks/form"
import { useAudiobookState } from "../../state/audiobook.state"
import { toFormDate } from "../../utils/utils"
import { AuthorForm } from "./author-form"
import { AuthorSearch } from "./author-search"

const mergeMetaIntoAuthor = ({ ...author }: AuthorApiModel, meta: MetadataAuthor): AuthorApiModel => {
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

export const AuthorEdit: FC<{ author: AuthorApiModel; authorId: UUID; libraryId: UUID }> = ({
  author,
  authorId,
  libraryId,
}) => {
  const updateAuthor = useAudiobookState(s => s.updateAuthor)
  const form = useForm(author, {
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
        await updateAuthor({ libraryId, id: authorId }, values)
        closeModal()
      }}
      InformationDisplay={() => <AuthorForm form={form} />}
      Search={({ onSelect }) => (
        <AuthorSearch
          libraryId={libraryId}
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
