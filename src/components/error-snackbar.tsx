import React from "react"
import { useSnackbar } from "./snackbar"
import { useOnMount } from "@thoth/hooks/lifecycle"

/**
 * Move to own component to prevent re-rendering of the dom every time a new snackbar gets displayed
 */
export const ErrorSnackbar: React.FC = () => {
  const _snackbar = useSnackbar()

  useOnMount(() => {
    // TODO fix
    // const subscription = GlobalClientErrors.subscribe(e => {
    //   snackbar.show(
    //     <>
    //       <table>
    //         <tbody>
    //           <tr>
    //             <td className="pr-2 font-black	">Message:</td>
    //             <td>{e.error}</td>
    //           </tr>
    //           <tr>
    //             <td className="pr-2 font-black	">URL:</td>
    //             <td>
    //               {e.method} - {e.url}
    //             </td>
    //           </tr>
    //         </tbody>
    //       </table>
    //     </>,
    //     { closable: true, type: "error", timeout: 5000 }
    //   )
    // })
    // return () => subscription.unsubscribe()
  })
  return <></>
}
