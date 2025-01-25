"use client"

import { useEffect } from "react"
import { User } from "@thoth/components/account/account"
import { useAuthState } from "@thoth/state/auth.state"
import { useHttpRequest } from "@thoth/hooks/async-response"
import { Api } from "@thoth/client"

export default function AccountOutlet() {
  const { result, invoke } = useHttpRequest(Api.getCurrentUser)
  const jwt = useAuthState(s => s.accessTokenStr)
  useEffect(() => void invoke(), [jwt, invoke])
  return result && <User user={result} />
}
