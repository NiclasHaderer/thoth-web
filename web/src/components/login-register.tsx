import { RefreshCwIcon, LockIcon, UserIcon, EyeIcon, EyeOffIcon } from "lucide-react"
import { FC, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { useLocation, useSearch } from "wouter"
import { Logo } from "@thoth/components/icons/logo"
import { ManagedInput } from "@thoth/components/input/managed-input"
import { Link } from "@thoth/components/link.tsx"
import { Button } from "@thoth/components/ui/button"
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
  const userState = useAuthState()

  const loginOrRegister = async ({ confirmPassword: _confirmPassword, ...credentials }: (typeof form)["fields"]) => {
    setSubmitting(true)
    try {
      const cb = isRegister ? userState.register : userState.login
      const result = await cb(credentials)
      if (!result.success) {
        toast.error(errorMessage(result.error))
        return
      }
      navigate(redirectPath || "/libraries", { replace: true })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-dvh w-full flex-col items-center justify-center gap-4 p-6">
      <div className="relative flex w-full max-w-sm">
        <h1 className="mb-4 font-serif text-3xl font-extrabold">{isRegister ? "Register" : "Login"}</h1>
        <div>
          <Logo className="absolute right-0 bottom-0 h-auto w-1/6" />
        </div>
      </div>
      <Form form={form} onSubmit={loginOrRegister}>
        <div className="sm:bg-card flex w-full max-w-sm flex-col gap-3 sm:rounded-xl sm:p-6">
          <ManagedInput
            name="username"
            groupClassName="bg-popover"
            placeholder={isRegister ? "Choose a username" : "Your username"}
            leftIcon={<UserIcon />}
            autoComplete="username"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            autoFocus={true}
          />
          <ManagedInput
            name="password"
            type={passwordVisible ? "text" : "password"}
            groupClassName="bg-popover"
            placeholder={isRegister ? "At least 6 characters" : "Your password"}
            leftIcon={<LockIcon />}
            autoComplete={isRegister ? "new-password" : "current-password"}
            rightIcon={
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
            }
          />
          {isRegister ? (
            <ManagedInput
              name="confirmPassword"
              type={passwordVisible ? "text" : "password"}
              groupClassName="bg-popover"
              placeholder="Re-enter your password"
              leftIcon={<LockIcon />}
              autoComplete="new-password"
            />
          ) : null}
          <Button type="submit" size="lg" isDisabled={submitting} className="w-full disabled:opacity-60">
            {submitting ? <RefreshCwIcon className="animate-spin" /> : isRegister ? "Register" : "Login"}
          </Button>
          <p className="text-muted-foreground text-center text-sm">
            {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
            <Link
              href={isRegister ? `/login?${search}` : `/register?${search}`}
              className="text-foreground focus-visible:ring-primary/60 rounded font-medium underline focus-visible:ring-2 focus-visible:outline-none"
            >
              {isRegister ? "Login" : "Register"}
            </Link>
          </p>
        </div>
      </Form>
    </div>
  )
}
