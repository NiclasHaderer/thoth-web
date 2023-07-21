"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { UUID } from "@thoth/client"

export default function LibraryIdOutlet({ params: { libraryId } }: { params: { libraryId: UUID } }) {
  const router = useRouter()
  useEffect(() => {
    router.push(`/libraries/${libraryId}/books`)
  })
  return null
}
