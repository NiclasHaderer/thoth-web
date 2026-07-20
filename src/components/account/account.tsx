import { FC } from "react"
import { MdBadge } from "react-icons/md"
import { Api, ThothUserWithPermissions, UserPermissions } from "@thoth/client"
import { ColoredButton } from "@thoth/components/colored-button.tsx"
import { ManagedInput } from "@thoth/components/input/managed-input.tsx"
import { useSnackbar } from "@thoth/components/snackbar.tsx"
import { Form, useForm } from "@thoth/hooks/form.tsx"
import { useOnMount } from "@thoth/hooks/lifecycle.ts"
import { useAudiobookState } from "@thoth/state/audiobook.state.ts"
import { apiErrorMessage } from "@thoth/utils/utils.ts"

export const User: FC<{ user: ThothUserWithPermissions<UserPermissions> }> = ({ user }) => {
  const fetchLibraries = useAudiobookState(s => s.fetchLibraries)
  const { show } = useSnackbar()

  const form = useForm({
    username: user.username,
  })

  useOnMount(() => fetchLibraries())

  return (
    <Form
      form={form}
      onSubmit={async values => {
        const result = await Api.updateUsername({ id: user.id }, { username: values.username })
        if (!result.success) show(apiErrorMessage(result.error), { type: "error" })
      }}
    >
      <h2 className="mb-4 text-2xl font-bold">User Profile</h2>

      <div className="mb-4">
        <ManagedInput
          name="username"
          label="Username"
          labelClassName="font-bold w-36"
          leftIcon={<MdBadge />}
          type="text"
          className="rounded px-2 py-1"
        />
      </div>

      <div className="mb-4">
        <b className="inline-block w-36 px-2 font-bold">Admin</b>
        <span>{user.permissions.isAdmin ? "Yes" : "No"}</span>
      </div>

      <div className="mb-4">
        <b className="inline-block w-36 px-2 font-bold">Library Access</b>
        <span>
          {user.permissions.libraries.length === 0 ? (
            <span className="text-font-secondary">No library access</span>
          ) : (
            user.permissions.libraries.map(library => (
              <span key={library.id} className="mr-2">
                {library.name} ({library.permissions})
              </span>
            ))
          )}
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
