import { SearchIcon } from "lucide-react"
import { FC, KeyboardEvent, useRef, useState } from "react"
import { Input } from "@thoth/components/input/input"
import { SearchResults } from "@thoth/components/menu/search-results"
import { useLibrarySearch } from "@thoth/hooks/library-search"
import { useGlobalEvent } from "../../hooks/global-events"
import { useFocusTrap } from "../../hooks/trap-focus"

export const Search: FC = () => {
  const { query, setQuery, result } = useLibrarySearch()
  const [resultVisible, setResultVisible] = useState(false)
  const [prevQuery, setPrevQuery] = useState("")
  const [searchOverlay, setSearchOverlay] = useState<HTMLDivElement | null>(null)
  const inputElement = useRef<HTMLInputElement | null>(null)
  const { focusPrevious, focusNext } = useFocusTrap(searchOverlay, () => !resultVisible)

  useGlobalEvent(
    "keyup",
    () => setResultVisible(false),
    event => event.key === "Escape"
  )

  useGlobalEvent("click", (event: MouseEvent) => {
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
    <div className="relative grow px-3 shadow-none" onKeyDown={modifyFocus} ref={setSearchOverlay}>
      <Input
        hideError
        groupClassName="bg-popover dark:bg-popover focus-within:bg-accent dark:focus-within:bg-accent rounded-3xl! h-auto py-1 border-0 transition-colors has-[[data-slot=input-group-control]:focus-visible]:ring-0 has-[[data-slot=input-group-control]:focus-visible]:border-0"
        leftIcon={<SearchIcon className="mx-1 h-6 w-6" />}
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
