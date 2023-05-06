"use client"
import React from "react"
import { BottomBar, MainWindow, TopBar } from "@thoth/components/layout"
import "../../../styles/globals.css"
import "../../../styles/reset.css"
import { NoSsr } from "@thoth/components/no-ssr"

export default function LibraryLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col">
      <NoSsr>
        <TopBar />
        <MainWindow>{children}</MainWindow>
        <BottomBar />
      </NoSsr>
    </div>
  )
}
