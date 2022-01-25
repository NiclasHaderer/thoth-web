import React, { memo } from "react"

import { BottomBar, MainWindow, TopBar } from "./MainLayout"
import { ErrorSnackbar } from "./ErrorSnackbar"

const App = memo(() => {
  return (
    <>
      <ErrorSnackbar />
      <div className="h-full flex flex-col">
        <TopBar />
        <MainWindow />
        <BottomBar />
      </div>
    </>
  )
})

export default App
