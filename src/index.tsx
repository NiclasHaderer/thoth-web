import React from "react"
import ReactDOM from "react-dom"
import { App } from "./index/app"
import { SnackbarProvider } from "./index/app/common/snackbar"
import "./index/index.scss"
import "./index/tailwind.css"
import "preact/debug"

ReactDOM.render(
  <React.StrictMode>
    <SnackbarProvider>
      <App />
    </SnackbarProvider>
  </React.StrictMode>,
  document.getElementById("root")
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(console.log);
