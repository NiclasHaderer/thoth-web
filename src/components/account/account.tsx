import { FC } from "react"
import { MdBadge } from "react-icons/md"
import { Api, ThothUserWithPermissions, UserPermissions } from "@thoth/client"
import { ColoredButton } from "@thoth/components/colored-button.tsx"
import { ManagedInput } from "@thoth/components/input/managed-input.tsx"
import { Form, useForm } from "@thoth/hooks/form.tsx"
import { useOnMount } from "@thoth/hooks/lifecycle.ts"
import { useAudiobookState } from "@thoth/state/audiobook.state.ts"

export const User: FC<{ user: ThothUserWithPermissions<UserPermissions> }> = ({ user }) => {
  const fetchLibraries = useAudiobookState(s => s.fetchLibraries)

  const form = useForm({
    username: user.username,
  })

  useOnMount(() => fetchLibraries())

  return (
    <Form
      form={form}
      onSubmit={values => {
        Api.updateUsername({ id: user.id }, { username: values.username })
      }}
    >
      <h2 className="mb-4 text-2xl font-bold">
        User Profile <span className="text-base font-light">({user.id})</span>
      </h2>

      <div className="mb-4">
        <ManagedInput
          name="username"
          label="Username"
          labelClassName="font-bold w-28"
          leftIcon={<MdBadge />}
          type="text"
          className="rounded border px-2 py-1"
        />
      </div>

      <div className="mb-4">
        <b className="inline-block w-28 px-2 font-bold">Admin</b>
        <span>{user.permissions.isAdmin ? "Yes" : "No"}</span>
      </div>

      <div className="mb-4">
        <b className="inline-block w-28 px-2 font-bold">Libraries</b>
        <span>
          {user.permissions.libraries.map(library => (
            <span key={library.id} className="mr-2">
              {library.name} ({library.permissions})
            </span>
          ))}
        </span>
      </div>
      <div className="flex justify-between">
        <ColoredButton onClick={() => form.restoreInitial()} color="secondary">
          Cancel
        </ColoredButton>
        <ColoredButton type="submit" className="ml-2">
          Save
        </ColoredButton>
      </div>
    </Form>
  )
}
