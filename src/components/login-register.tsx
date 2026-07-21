import { FC, useEffect, useRef, useState } from "react"
import { MdAutorenew, MdLock, MdPerson, MdVisibility, MdVisibilityOff } from "react-icons/md"
import { Link, useLocation, useSearch } from "wouter"
import { ColoredButton } from "@thoth/components/colored-button"
import { IconButton } from "@thoth/components/icon-button"
import { Logo } from "@thoth/components/icons/logo"
import { InputError } from "@thoth/components/input/input-error"
import { ManagedInput } from "@thoth/components/input/managed-input"
import { Form, useForm } from "@thoth/hooks/form"
import { useAuthState } from "@thoth/state/auth.state"

const errorMessage = (error: string | object): string => {
  if (typeof error === "string") return error
  if (error && typeof error === "object" && "error" in error && typeof error.error === "string") return error.error
  return "Something went wrong"
}

export const LoginRegister: FC<{ type: "register" | "login"; redirectPath?: string }> = ({ type, redirectPath }) => {
  const isRegister = type === "register"
  const [, navigate] = useLocation()
  const search = useSearch()

  const passwordRef = useRef("")
  const form = useForm(
    {
      username: "",
      password: "",
      confirmPassword: "",
    },
    {
      validate: {
        username: value => value.length > 0 || "Username is required",
        password: value => {
          if (value.length === 0) return "Password is required"
          if (isRegister && value.length < 6) return "Password must be at least 6 characters long"
          return true
        },
        confirmPassword: value => {
          if (!isRegister) return true
          if (value.length === 0) return "Please confirm your password"
          return value === passwordRef.current || "Passwords do not match"
        },
      },
    }
  )
  useEffect(() => {
    passwordRef.current = form.fields.password
  }, [form.fields.password])

  const [passwordVisible, setPasswordVisible] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const userState = useAuthState()

  const loginOrRegister = async ({ confirmPassword: _confirmPassword, ...credentials }: (typeof form)["fields"]) => {
    setError(null)
    setSubmitting(true)
    try {
      const cb = isRegister ? userState.register : userState.login
      const result = await cb(credentials)
      if (!result.success) {
        setError(errorMessage(result.error))
        return
      }
      navigate(redirectPath || "/libraries", { replace: true })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="relative flex w-3/4 md:w-1/2 xl:w-1/4">
        <h1 className="mb-4 font-serif text-3xl font-extrabold">{isRegister ? "Register" : "Login"}</h1>
        <div>
          <Logo className="absolute right-0 bottom-0 h-auto w-1/6" />
        </div>
      </div>
      <Form form={form} onSubmit={loginOrRegister}>
        <div className="bg-elevate inline-block w-3/4 rounded p-4 md:w-1/2 xl:w-1/4">
          <ManagedInput
            name="username"
            labelClassName="w-28"
            className="bg-elevate-2"
            label="Username"
            placeholder={isRegister ? "Choose a username" : "Your username"}
            leftIcon={<MdPerson />}
            autoComplete="username"
            autoFocus={true}
          />
          <ManagedInput
            name="password"
            type={passwordVisible ? "text" : "password"}
            labelClassName="w-28"
            className="bg-elevate-2"
            label="Password"
            placeholder={isRegister ? "At least 6 characters" : "Your password"}
            leftIcon={<MdLock />}
            autoComplete={isRegister ? "new-password" : "current-password"}
            rightIcon={
              <IconButton
                tabIndex={-1}
                label={passwordVisible ? "Hide password" : "Show password"}
                icon={passwordVisible ? <MdVisibilityOff /> : <MdVisibility />}
                className="my-2 ml-2 block h-full"
                innerClassName="p-1"
                onClick={() => setPasswordVisible(prev => !prev)}
              />
            }
          />
          {isRegister ? (
            <ManagedInput
              name="confirmPassword"
              type={passwordVisible ? "text" : "password"}
              labelClassName="w-28"
              className="bg-elevate-2"
              label="Confirm"
              placeholder="Re-enter your password"
              leftIcon={<MdLock />}
              autoComplete="new-password"
            />
          ) : null}
          <InputError errors={error} />
          <div className="mt-2 flex items-center justify-between">
            <p>
              {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
              <Link
                href={isRegister ? `/login?${search}` : `/register?${search}`}
                className="focus-visible:ring-primary/60 rounded underline focus-visible:ring-2 focus-visible:outline-none"
              >
                {isRegister ? "Login" : "Register"}
              </Link>
            </p>
            <ColoredButton type="submit" disabled={submitting} className="disabled:opacity-60">
              {submitting ? <MdAutorenew className="animate-spin" /> : isRegister ? "Register" : "Login"}
            </ColoredButton>
          </div>
        </div>
      </Form>
    </div>
  )
}
