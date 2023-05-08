"use client"
import React from "react"
import "../styles/globals.css"
import "../styles/reset.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="dark-theme h-full bg-surface text-font">
        <div className="flex h-full flex-col">{children}</div>
      </body>
    </html>
  )
}
