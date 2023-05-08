"use client"

import { useAuthState } from "@thoth/state/auth.state"
import { useOnMount } from "@thoth/hooks/lifecycle"
import { useRouter } from "next/navigation"

export default function LogoutOutlet() {
  const auth = useAuthState()
  const router = useRouter()
  useOnMount(() => {
    auth.logout()
    router.push("/login")
  })

  return <div></div>
}
