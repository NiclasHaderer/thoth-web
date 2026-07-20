import { createContext, FC, PropsWithChildren, ReactElement, useContext, useRef, useState } from "react"
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

const Snackbar = createContext(error)

const classes: Record<SnackbarProps["type"], string> = {
  default: "",
  error: "border-solid border-primary border-2",
  warn: "border-solid border-orange-400 border-2",
}

export const SnackbarProvider: FC<PropsWithChildren> = ({ children }) => {
  const [elements, setElements] = useState<SnackbarStore>({})
  // A ref holds the source of truth so rapid consecutive calls don't race on stale state
  const store = useRef<SnackbarStore>({})
  const nextKey = useRef(0)

  const removeElement = (key: string) => {
    delete store.current[key]
    setElements({ ...store.current })
  }

  const addSnackbar = (
    element: ReactElement | string,
    { closable = true, timeout = 2000000, type = "default" }: SnackbarOptions = {}
  ) => {
    const key = String(nextKey.current++)
    store.current[key] = { element, closable, timeout, type }
    setElements({ ...store.current })
    setTimeout(() => removeElement(key), timeout)
  }

  return (
    <Snackbar.Provider value={addSnackbar}>
      {children}
      {Object.keys(elements).length > 0 ? (
        <div className="fixed right-0 bottom-0 p-8">
          {Object.entries(elements).map(([key, value]) => (
            <div key={key} className="bg-surface mb-3 overflow-hidden rounded-md">
              <div className={`bg-active relative p-2 ${classes[value.type]}`}>
                {value.closable ? (
                  <button className="absolute top-2 right-2 cursor-pointer" onClick={() => removeElement(key)}>
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
