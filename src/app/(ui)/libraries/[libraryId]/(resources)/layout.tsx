"use client"
import React from "react"
import { LibraryResourceView } from "@thoth/components/layout"

export default function LibraryLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LibraryResourceView>{children}</LibraryResourceView>
    </>
  )
}
