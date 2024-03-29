"use client"
import React, { useEffect } from "react"
import { Author } from "@thoth/components/account/account"
import { useAuthState } from "@thoth/state/auth.state"
import { useHttpRequest } from "@thoth/hooks/async-response"
import { Api } from "@thoth/client"

export default function AccountOutlet() {
  const { result, loading, invoke } = useHttpRequest(Api.getCurrentUser)
  const jwt = useAuthState(s => s.accessTokenStr)
  useEffect(() => void invoke(), [jwt, invoke])
  return result && <Author user={result} />
}
