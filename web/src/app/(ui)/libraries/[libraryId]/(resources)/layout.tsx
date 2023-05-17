"use client"
import React from "react"
import { LibraryResourceView } from "@thoth/components/library-resource-view"

export default function LibraryLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LibraryResourceView>{children}</LibraryResourceView>
    </>
  )
}
