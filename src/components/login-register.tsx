"use client"
import { MdLock, MdPerson } from "react-icons/md"
import React, { FC } from "react"
import { ColoredButton } from "@thoth/components/colored-button"
import Link from "next/link"
import { Form, useForm } from "@thoth/hooks/form"
import { Api } from "@thoth/client"
import { Logo } from "@thoth/components/icons/logo"
import { ManagedInput } from "@thoth/components/input/managed-input"

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

  const login = async (values: (typeof form)["fields"]) => {
    const jwt = await Api.loginUser(values)
    console.log(jwt)
  }

  const register = async (values: (typeof form)["fields"]) => {
    await Api.registerUser({
      ...values,
      admin: false,
      edit: false,
    })
    const jwt = await Api.loginUser(values)
    console.log(jwt)
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="relative flex w-3/4 justify-center md:w-1/2 xl:w-1/4">
        <h1 className="mb-4 font-serif text-3xl font-extrabold">THOTH</h1>
        <div>
          <Logo className="absolute bottom-0 right-0 h-auto w-1/6" />
        </div>
      </div>
      <Form
        form={form}
        onSubmit={async values => {
          if (type === "login") {
            await login(values)
          } else {
            await register(values)
          }
        }}
      >
        <div className="inline-block w-3/4 rounded bg-elevate p-4 md:w-1/2 xl:w-1/4">
          <h1 className="text-xl">{type === "login" ? "Login" : "Register"}</h1>
          <ManagedInput
            name="username"
            labelClassName="w-28"
            className="bg-elevate-2"
            label="Username"
            icon={<MdPerson />}
            autoFocus={true}
          />
          <ManagedInput
            name="password"
            labelClassName="w-28"
            className="bg-elevate-2"
            label="Password"
            icon={<MdLock />}
          />
          <div className="flex justify-between">
            <Link href={type === "login" ? "/register" : "/login"}>
              <ColoredButton type="button" className="mt-2 self-center">
                {type === "login" ? "Register" : "Login"}
              </ColoredButton>
            </Link>
            <ColoredButton type="submit" className="mt-2 self-center">
              {type === "login" ? "Login" : "Register"}
            </ColoredButton>
          </div>
        </div>
      </Form>
    </div>
  )
}
