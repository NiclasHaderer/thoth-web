"use client"
import React from "react"
import { BottomBar, MainWindow, TopBar } from "@thoth/components/layout"
import "../../styles/globals.css"
import "../../styles/reset.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="dark-theme h-full bg-surface text-font">
        <div className="flex h-full flex-col">
          <TopBar />
          <MainWindow>{children}</MainWindow>
          <BottomBar />
        </div>
      </body>
    </html>
  )
}
