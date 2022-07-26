import React, { memo } from "react"

import { BottomBar, MainWindow, TopBar } from "./MainLayout"
import { ErrorSnackbar } from "./ErrorSnackbar"
import { Route, Switch } from "wouter"

const Account = React.lazy(() => import("./App/Account/Account"))

const App = memo(() => {
  return (
    <>
      <div className="flex h-full flex-col">
        <TopBar />
        <Switch>
          <Route path="/account">
            <React.Suspense fallback={<div />}>
              <Account />
            </React.Suspense>
          </Route>
          <Route path="">
            <MainWindow />
          </Route>
        </Switch>
        <BottomBar />
      </div>
      <ErrorSnackbar />
    </>
  )
})

export default App
