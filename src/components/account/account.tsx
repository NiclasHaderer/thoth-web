import {
  EyeIcon,
  EyeOffIcon,
  IdCardIcon,
  LibraryIcon,
  LockIcon,
  PencilIcon,
  ShieldCheckIcon,
  Trash2Icon,
} from "lucide-react"
import { FC, useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"
import { Api, ThothUserWithPermissions, UserPermissions } from "@thoth/client"
import { ManagedInput } from "@thoth/components/input/managed-input.tsx"
import { Avatar, AvatarFallback } from "@thoth/components/ui/avatar"
import { Badge } from "@thoth/components/ui/badge"
import { Button } from "@thoth/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@thoth/components/ui/dialog"
import { Form, useForm } from "@thoth/hooks/form.tsx"
import { useOnMount } from "@thoth/hooks/lifecycle.ts"
import { useAudiobookState } from "@thoth/state/audiobook.state.ts"
import { useAuthState } from "@thoth/state/auth.state"
import { useCurrentUserState } from "@thoth/state/current-user.state"
import { apiErrorMessage } from "@thoth/utils/utils.ts"

export const User: FC<{ user: ThothUserWithPermissions<UserPermissions> }> = ({ user }) => {
  const fetchLibraries = useAudiobookState(s => s.fetchLibraries)
  const setUsername = useCurrentUserState(s => s.setUsername)
  const logout = useAuthState(s => s.logout)

  const deleteAccount = async () => {
    const res = await Api.deleteUser({ id: user.id })
    if (!res.success) {
      toast.error(apiErrorMessage(res.error))
      return
    }
    await logout()
    window.location.replace("/#/login")
    window.location.reload()
  }

  const usernameInitial = useMemo(() => ({ username: user.username }), [user.username])
  const usernameForm = useForm(usernameInitial, {
    validate: {
      username: value => value.length >= 3 || "Username must be at least 3 characters",
    },
    reloadOnInitialChange: true,
  })

  const newPasswordRef = useRef("")
  const passwordForm = useForm(
    {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    {
      validate: {
        currentPassword: value => value.length > 0 || "Current password is required",
        newPassword: value => value.length >= 6 || "Password must be at least 6 characters",
        confirmPassword: value => {
          if (value.length === 0) return "Please confirm your password"
          return value === newPasswordRef.current || "Passwords do not match"
        },
      },
    }
  )
  useEffect(() => {
    newPasswordRef.current = passwordForm.fields.newPassword
  }, [passwordForm.fields.newPassword])

  useOnMount(() => fetchLibraries())

  const [passwordVisible, setPasswordVisible] = useState(false)
  const passwordToggle = (
    <Button
      excludeFromTabOrder
      variant="ghost"
      size="icon"
      aria-label={passwordVisible ? "Hide password" : "Show password"}
      className="my-2 ml-2 h-full"
      onPress={() => setPasswordVisible(prev => !prev)}
    >
      {passwordVisible ? <EyeOffIcon /> : <EyeIcon />}
    </Button>
  )

  const libraries = user.permissions.libraries

  return (
    <>
      <div className="bg-card flex flex-col gap-4 rounded-xl p-4">
        <div className="flex items-center gap-4">
          <Avatar size="lg" className="size-14">
            <AvatarFallback className="text-lg font-medium">{user.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="truncate text-lg font-semibold">{user.username}</span>
              {user.permissions.isAdmin && (
                <Badge variant="secondary">
                  <ShieldCheckIcon />
                  Admin
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-sm">
              {libraries.length === 0
                ? "No library access"
                : `Access to ${libraries.length} librar${libraries.length === 1 ? "y" : "ies"}`}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-muted-foreground text-sm font-medium">Library access</h3>
          {libraries.length === 0 ? (
            <p className="text-base md:text-sm">You don't have access to any library.</p>
          ) : (
            <div className="divide-border flex flex-col divide-y text-base md:text-sm">
              {libraries.map(library => (
                <div key={library.id} className="flex items-center justify-between py-2 first:pt-0 last:pb-0">
                  <span className="flex min-w-0 items-center gap-2">
                    <LibraryIcon className="text-muted-foreground size-4 shrink-0" />
                    <span className="truncate">{library.name}</span>
                  </span>
                  <Badge variant="secondary">
                    {library.permissions === "READ_WRITE" ? (
                      <PencilIcon className="text-muted-foreground" />
                    ) : (
                      <EyeIcon className="text-muted-foreground" />
                    )}
                    {library.permissions === "READ_WRITE" ? "Read & write" : "Read only"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Form
          form={usernameForm}
          className="bg-card flex flex-col gap-2 rounded-xl p-4"
          onSubmit={async values => {
            const result = await Api.updateUsername({ id: user.id }, { username: values.username })
            if (!result.success) {
              toast.error(apiErrorMessage(result.error))
              return
            }
            setUsername(values.username)
            toast.success("Username updated")
          }}
        >
          <h3 className="text-muted-foreground text-sm font-medium">Username</h3>
          <ManagedInput name="username" leftIcon={<IdCardIcon />} placeholder="Username" />
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button onPress={() => usernameForm.restoreInitial()} variant="secondary" className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              Save
            </Button>
          </div>
        </Form>

        <Form
          form={passwordForm}
          className="bg-card flex flex-col gap-2 rounded-xl p-4"
          onSubmit={async values => {
            const result = await Api.updatePassword(
              { id: user.id },
              { currentPassword: values.currentPassword, newPassword: values.newPassword }
            )
            if (!result.success) {
              toast.error(apiErrorMessage(result.error))
              return
            }
            passwordForm.restoreInitial()
            toast.success("Password updated")
          }}
        >
          <h3 className="text-muted-foreground text-sm font-medium">Password</h3>
          <ManagedInput
            name="currentPassword"
            type={passwordVisible ? "text" : "password"}
            leftIcon={<LockIcon />}
            placeholder="Current password"
            autoComplete="current-password"
            rightIcon={passwordToggle}
          />
          <ManagedInput
            name="newPassword"
            type={passwordVisible ? "text" : "password"}
            leftIcon={<LockIcon />}
            placeholder="New password"
            autoComplete="new-password"
            rightIcon={passwordToggle}
          />
          <ManagedInput
            name="confirmPassword"
            type={passwordVisible ? "text" : "password"}
            leftIcon={<LockIcon />}
            placeholder="Confirm new password"
            autoComplete="new-password"
            rightIcon={passwordToggle}
          />
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button onPress={() => passwordForm.restoreInitial()} variant="secondary" className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              Update password
            </Button>
          </div>
        </Form>
      </div>

      <div className="border-destructive/30 flex flex-col gap-3 rounded-xl border p-4">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-destructive text-sm font-medium">Delete account</h3>
          <p className="text-muted-foreground text-sm">
            Permanently delete your account and all associated data. This cannot be undone.
          </p>
        </div>
        <DialogTrigger>
          <Button variant="destructive" className="w-full sm:w-auto sm:self-end">
            <Trash2Icon />
            Delete account
          </Button>
          <Dialog showCloseButton={false}>
            <DialogHeader>
              <DialogTitle>Delete your account?</DialogTitle>
              <DialogDescription>This permanently deletes your account and cannot be undone.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose>Cancel</DialogClose>
              <Button variant="destructive" onPress={deleteAccount}>
                Delete account
              </Button>
            </DialogFooter>
          </Dialog>
        </DialogTrigger>
      </div>
    </>
  )
}
