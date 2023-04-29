"use client"
import { Input } from "@thoth/components/input/input"
import { MdLock, MdPerson } from "react-icons/md"
import React from "react"
import { ColoredButton } from "@thoth/components/colored-button"
import Link from "next/link"

export default function LoginOutlet() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="relative flex w-3/4 justify-center md:w-1/2 xl:w-1/4">
        <h1 className="mb-4 font-serif text-3xl font-extrabold">THOTH</h1>
        <img src="/logo.svg" className="absolute bottom-0 right-0 w-1/6" />
      </div>
      <div className="inline-block w-3/4 rounded bg-elevate p-4 md:w-1/2 xl:w-1/4">
        <h1 className="text-xl">Login</h1>
        <Input autoFocus={true} name="username" labelClassName="w-28" label="Username" icon={<MdPerson />} />
        <Input name="password" labelClassName="w-28" label="Password" icon={<MdLock />} />
        <div className="flex justify-between">
          <Link href={"/signup"}>
            <ColoredButton className="mt-2 self-center">Register</ColoredButton>
          </Link>
          <ColoredButton className="mt-2 self-center">Login</ColoredButton>
        </div>
      </div>
    </div>
  )
}
