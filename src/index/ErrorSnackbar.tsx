import React from "react"
import { useSnackbar } from "./App/Common/Snackbar"
import { useOnMount } from "./Hooks/OnMount"
import { GlobalClientErrors } from "./Client/WithErrorHandler"

/**
 * Move to own component to prevent re-rendering of the dom every time a new snackbar gets displayed
 */
export const ErrorSnackbar: React.VFC = () => {
  const snackbar = useSnackbar()

  useOnMount(() => {
    const subscription = GlobalClientErrors.subscribe(e => {
      snackbar.show(
        <>
          <table>
            <tbody>
              <tr>
                <td className="pr-2 font-black	">Message:</td>
                <td>{e.error}</td>
              </tr>
              <tr>
                <td className="pr-2 font-black	">URL:</td>
                <td>
                  {e.method} - {e.url}
                </td>
              </tr>
            </tbody>
          </table>
        </>,
        { closable: true, type: "error", timeout: 5000 }
      )
    })
    return () => subscription.unsubscribe()
  })
  return <></>
}
