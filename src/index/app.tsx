import React, { memo } from "react"

import { BottomBar, MainWindow, TopBar } from "./layout"
import { ErrorSnackbar } from "./app/common/error-snackbar"

export const App = memo(() => {
  return (
    <>
      <div className="flex h-full flex-col">
        <TopBar />
        <MainWindow />
        <BottomBar />
      </div>
      <ErrorSnackbar />
    </>
  )
})
