"use client"
import { Input } from "@thoth/components/input/input"
import { MdLock, MdPerson } from "react-icons/md"
import React from "react"
import { ColoredButton } from "@thoth/components/colored-button"
import Link from "next/link"
import SignupLayout from "@thoth/app/signup/layout"

export default function SignupOutlet() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="inline w-1/2 rounded bg-elevate">
        <h1>Signup</h1>
        <Input autoFocus={true} name="username" labelClassName="w-28" label="Username" icon={<MdPerson />} />
        <Input name="password" labelClassName="w-28" label="Password" icon={<MdLock />} />
        <div className="flex justify-between">
          <Link href={"/login"}>
            <ColoredButton className="mt-2 self-center">Login</ColoredButton>
          </Link>
          <ColoredButton className="mt-2 self-center">Login</ColoredButton>
        </div>
      </div>
    </div>
  )
}
