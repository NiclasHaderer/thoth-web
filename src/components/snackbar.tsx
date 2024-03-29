import React, { PropsWithChildren, ReactElement, useContext, useState } from "react"
import { MdClose } from "react-icons/md"

type SnackbarOptions = {
  closable?: boolean
  timeout?: number
  type?: "default" | "error" | "warn"
}

type SnackbarProps = {
  element: ReactElement | string
  closable: boolean
  timeout: number
  type: "default" | "error" | "warn"
}

type SnackbarStore = { [key: string]: SnackbarProps }

const error = (__: ReactElement | string, _?: SnackbarOptions) => {
  console.error("You cannot use the Snackbar without the provided SnackbarProvider")
}

const Snackbar = React.createContext(error)

// Use this global store as single source of trough, because using setState
// would cause a race condition
const globalStore: SnackbarStore = {}

const classes: Record<SnackbarProps["type"], string> = {
  default: "",
  error: "border-solid border-primary border-2",
  warn: "border-solid border-orange-400 border-2",
}

export const SnackbarProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [elements, setElements] = useState<SnackbarStore>({})

  const addSnackbar = (
    element: ReactElement | string,
    { closable = true, timeout = 2000000, type = "default" }: SnackbarOptions = {}
  ) => {
    const key = Math.random().toString()
    globalStore[key] = { element, closable, timeout, type }
    setElements({ ...globalStore })
    setTimeout(() => removeElement(key), timeout)
  }

  const removeElement = (key: string) => {
    delete globalStore[key]
    setElements({ ...globalStore })
  }

  return (
    <Snackbar.Provider value={addSnackbar}>
      {children}
      {Object.keys(elements).length > 0 ? (
        <div className="fixed bottom-0 right-0 p-8">
          {Object.entries(elements).map(([key, value]) => (
            <div key={key} className="mb-3 overflow-hidden rounded-md bg-surface">
              <div className={`relative bg-active p-2 ${classes[value.type]}`}>
                {value.closable ? (
                  <button className="absolute right-2 top-2 cursor-pointer" onClick={() => removeElement(key)}>
                    <MdClose className="h-6 w-6" />
                  </button>
                ) : null}
                <div className="pr-8">{value.element}</div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </Snackbar.Provider>
  )
}

export const useSnackbar = () => ({
  show: useContext(Snackbar),
})
