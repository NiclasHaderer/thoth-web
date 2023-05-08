"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function IndexOutlet() {
  const router = useRouter()
  useEffect(() => router.replace("/libraries"))
  return <></>
}
