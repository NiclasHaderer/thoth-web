import React, { ReactElement, useState } from "react"
import { MdClose } from "react-icons/md"

type SnackbarOptions = {
  closable?: boolean
  timeout?: number
  type?: "default" | "error" | "warn"
}

type SnackbarProps = {
  element: ReactElement
  closable: boolean
  timeout: number
  type: "default" | "error" | "warn"
}

type SnackbarStore = { [key: string]: SnackbarProps }

const error = (__: ReactElement, _?: SnackbarOptions) => {
  console.error("You cannot use the Snackbar without the provided SnackbarProvider")
}

export const Snackbar = React.createContext(error)

// Use this global store as single source of trough, because using setState
// would cause a race condition
const globalStore: SnackbarStore = {}

const classes: Record<SnackbarProps["type"], string> = {
  default: "",
  error: "border-solid border-primary border-2",
  warn: "border-solid border-orange-400 border-2",
}

export const SnackbarProvider: React.FC = ({ children }) => {
  const [elements, setElements] = useState<SnackbarStore>({})

  const addSnackbar = (
    element: ReactElement,
    { closable = true, timeout = 2000, type = "default" }: SnackbarOptions = {}
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
        <div className="fixed right-0 bottom-0 p-8">
          {Object.entries(elements).map(([key, value]) => (
            <div key={key} className="bg-background mb-3">
              <div className={`bg-active relative p-2 rounded-md ${classes[value.type]}`}>
                {value.closable ? (
                  <button className="top-2 right-2 cursor-pointer absolute" onClick={() => removeElement(key)}>
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
