"use client"

import { AuthState, useAuthState } from "@thoth/state/auth.state"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function IndexOutlet() {
  const auth = useAuthState() as AuthState
  const router = useRouter()
  useEffect(() => router.push("/libraries"))
  return <></>
}
