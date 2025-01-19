import { FC, useState } from "react"
import { type ThothUser, type UserPermissionsModel, type UUID } from "@thoth/client"
import { Input } from "@thoth/components/input/input"
import { MdBadge } from "react-icons/md"

export const User: FC<{ user: ThothUser<UUID, UserPermissionsModel> }> = ({ user }) => {
  const [username, setUsername] = useState(user.username)

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">
        User Profile <span className="text-base font-light">({user.id})</span>
      </h2>

      <div className="mb-4">
        <Input
          label="Username"
          labelClassName="font-bold w-28"
          leftIcon={<MdBadge />}
          value={username}
          onValue={setUsername}
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
              {library.name} ({library.canEdit ? "Edit" : "Read"})
            </span>
          ))}
        </span>
      </div>
    </div>
  )
}
