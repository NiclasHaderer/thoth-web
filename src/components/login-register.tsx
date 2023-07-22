"use client"
import { MdLock, MdPerson, MdVisibility, MdVisibilityOff } from "react-icons/md"
import React, { FC, useState } from "react"
import { ColoredButton } from "@thoth/components/colored-button"
import Link from "next/link"
import { Form, useForm } from "@thoth/hooks/form"
import { Logo } from "@thoth/components/icons/logo"
import { ManagedInput } from "@thoth/components/input/managed-input"
import { useAuthState } from "@thoth/state/auth.state"
import { useRouter } from "next/navigation"
import { NoSSR } from "next/dist/shared/lib/lazy-dynamic/dynamic-no-ssr"

export const LoginRegister: FC<{ type: "register" | "login" }> = ({ type }) => {
  const form = useForm(
    {
      username: "",
      password: "",
    },
    {
      validate: {
        username: value => value.length > 0 || "Username is required",
        password: value => value.length > 0 || "Password is required",
      },
    }
  )
  const [passwordVisible, setPasswordVisible] = useState(false)
  const userState = useAuthState()
  const router = useRouter()

  const loginOrRegister = async (values: (typeof form)["fields"]) => {
    const cb = type === "login" ? userState.login : userState.register
    const result = await cb(values)
    if (!result.success) return
    const origin = new URLSearchParams(location().search).get("origin") ?? "/"
    router.push(`/${origin}`.replaceAll("//", "/"))
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="relative flex w-3/4 justify-center md:w-1/2 xl:w-1/4">
        <h1 className="mb-4 font-serif text-3xl font-extrabold">THOTH</h1>
        <div>
          <Logo className="absolute bottom-0 right-0 h-auto w-1/6" />
        </div>
      </div>
      <Form form={form} onSubmit={loginOrRegister}>
        <div className="inline-block w-3/4 rounded bg-elevate p-4 md:w-1/2 xl:w-1/4">
          <h1 className="text-xl">{type === "login" ? "Login" : "Register"}</h1>
          <ManagedInput
            name="username"
            labelClassName="w-28"
            className="bg-elevate-2"
            label="Username"
            leftIcon={<MdPerson />}
            autoFocus={true}
          />
          <ManagedInput
            name="password"
            type={passwordVisible ? "text" : "password"}
            labelClassName="w-28"
            className="bg-elevate-2"
            label="Password"
            leftIcon={<MdLock />}
            rightIcon={
              <button
                type="button"
                className="my-2 ml-2 block h-full"
                onClick={e => {
                  setPasswordVisible(prev => !prev)
                  // This fixes the same event being picked up twice
                  if (e.target === e.currentTarget) setPasswordVisible(prev => !prev)
                }}
              >
                {passwordVisible ? <MdVisibilityOff /> : <MdVisibility />}
              </button>
            }
          />
          <div className="flex justify-end">
            <ColoredButton type="submit" className="mt-2 self-center">
              {type === "login" ? "Login" : "Register"}
            </ColoredButton>
          </div>
          <p className="p-2">
            {type === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <NoSSR>
              <Link
                href={
                  type === "login" ? `/register?${location().search.slice(1)}` : `/login?${location().search.slice(1)}`
                }
                className="underline"
              >
                {type === "login" ? "Register" : "Login"}
              </Link>
            </NoSSR>
          </p>
        </div>
      </Form>
    </div>
  )
}

const location = () => {
  if (typeof window === "undefined") return { search: "" }
  return window.location
}
