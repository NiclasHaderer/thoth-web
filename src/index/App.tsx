import React, { memo, useContext } from "react"

import { BottomBar, MainWindow, TopBar } from "./MainLayout"
import { Snackbar } from "./App/Common/Snackbar"

const App = memo(() => {
  const addSnackbar = useContext(Snackbar)
  const add = () => {
    addSnackbar(<div>asdf</div>, { type: "warn" })
  }
  return (
    <div className="h-full flex flex-col">
      <div onClick={add}>add</div>
      <TopBar />
      <MainWindow />
      <BottomBar />
    </div>
  )
})

export default App
