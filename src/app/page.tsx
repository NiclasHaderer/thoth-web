"use client"

import { AuthState, useAuthState } from "@thoth/state/auth.state"
import { useRouter } from "next/navigation"

export default function IndexOutlet() {
  const auth = useAuthState() as AuthState
  const router = useRouter()
  router.push("/libraries")
  return <></>
}
