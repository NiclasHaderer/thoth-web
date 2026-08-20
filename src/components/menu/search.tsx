import { CommandIcon, SearchIcon } from "lucide-react"
import { FC, KeyboardEvent, ReactNode, useRef, useState } from "react"
import { Input } from "@thoth/components/input/input"
import { SearchResults } from "@thoth/components/menu/search-results"
import { useLibrarySearch } from "@thoth/queries/library-search"
import { useEvent } from "../../hooks/events"
import { useFocusTrap } from "../../hooks/trap-focus"

const KeyCap: FC<{ children: ReactNode }> = ({ children }) => (
  <kbd className="border-border/60 text-muted-foreground/80 flex h-5 min-w-5 items-center justify-center rounded-md border px-1 text-[0.7rem] font-medium shadow-xs">
    {children}
  </kbd>
)

export const Search: FC = () => {
  const { query, setQuery, result } = useLibrarySearch()
  const [resultVisible, setResultVisible] = useState(false)
  const [prevQuery, setPrevQuery] = useState("")
  const [searchOverlay, setSearchOverlay] = useState<HTMLDivElement | null>(null)
  const inputElement = useRef<HTMLInputElement | null>(null)
  const { focusPrevious, focusNext } = useFocusTrap(searchOverlay, () => !resultVisible)

  useEvent(window, "keyup", event => {
    if (event.key === "Escape") setResultVisible(false)
  })

  useEvent(window, "keydown", event => {
    if (event.key.toLowerCase() !== "k" || !(event.metaKey || event.ctrlKey)) return
    event.preventDefault()
    inputElement.current?.focus()
    inputElement.current?.select()
  })

  useEvent(window, "click", event => {
    if (!searchOverlay?.contains(event.target as HTMLElement) && inputElement.current !== event.target) {
      setResultVisible(false)
    }
  })

  const modifyFocus = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowUp") {
      event.preventDefault()
      focusPrevious()
    } else if (event.key === "ArrowDown") {
      event.preventDefault()
      focusNext()
    }
  }

  if (query !== prevQuery) {
    setPrevQuery(query)
    setResultVisible(query !== "")
  }

  return (
    <div className="relative mx-auto w-full max-w-xl px-3 shadow-none" onKeyDown={modifyFocus} ref={setSearchOverlay}>
      <Input
        hideError
        groupClassName="group bg-popover dark:bg-popover focus-within:bg-accent dark:focus-within:bg-accent rounded-3xl! h-auto py-2 border-0 transition-colors has-[[data-slot=input-group-control]:focus-visible]:ring-0 has-[[data-slot=input-group-control]:focus-visible]:border-0"
        leftIcon={<SearchIcon className="mx-1 size-5" />}
        rightIcon={
          <span className="mr-1.5 flex items-center gap-1 transition-opacity duration-150 group-focus-within:opacity-0">
            <KeyCap>
              <CommandIcon className="size-3" />
            </KeyCap>
            <KeyCap>K</KeyCap>
          </span>
        }
        placeholder="Search ..."
        inputRef={inputElement}
        onKeyUp={event => setQuery((event.target as HTMLInputElement).value)}
        onFocus={event => {
          if (event.target.value.trim() !== "") {
            setResultVisible(true)
          }
        }}
        onClick={event => {
          if ((event.target as HTMLInputElement).value.trim() !== "") {
            setResultVisible(true)
          }
        }}
      />
      {result && resultVisible ? (
        <div className="bg-popover absolute right-0 bottom-0 left-0 z-10 mx-3 translate-y-full overflow-hidden rounded-md p-3 shadow-2xl">
          <SearchResults search={result} onClose={() => setResultVisible(false)} />
        </div>
      ) : null}
    </div>
  )
}
