import React, { memo } from "react"

import { BottomBar, MainWindow, TopBar } from "./MainLayout"
import { ErrorSnackbar } from "./ErrorSnackbar"

const App = memo(() => {
  return (
    <>
      <ErrorSnackbar />
      <div className="flex h-full flex-col">
        <TopBar />
        <MainWindow />
        <BottomBar />
      </div>
    </>
  )
})

export default App
