import { SearchIcon } from "lucide-react"
import { LabeledInput } from "@thoth/components/input/labeled-input"
import { MobileTopBar } from "@thoth/components/menu/mobile-top-bar"
import { SearchResults } from "@thoth/components/menu/search-results"
import { useLibrarySearch } from "@thoth/queries/library-search-query"

// TODO: add recent searches
export const SearchOutlet = () => {
  const { query, setQuery, result } = useLibrarySearch(150)

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-3xl flex-col px-5 pb-4">
      <MobileTopBar className="bg-background/75">
        <div className="min-w-0 grow">
          <LabeledInput
            hideError
            autoFocus
            data-search-input
            groupClassName="bg-popover dark:bg-popover focus-within:bg-accent dark:focus-within:bg-accent rounded-3xl! h-auto py-2 border-0 transition-colors has-[[data-slot=input-group-control]:focus-visible]:ring-0 has-[[data-slot=input-group-control]:focus-visible]:border-0"
            leftIcon={<SearchIcon className="mx-1 size-5" />}
            placeholder="Search ..."
            value={query}
            onValue={setQuery}
          />
        </div>
      </MobileTopBar>

      {query.trim() !== "" ? (
        result ? (
          <SearchResults search={result} onClose={() => {}} />
        ) : null
      ) : (
        <p className="text-muted-foreground mt-16 text-center text-sm">Search books, series and authors.</p>
      )}
    </div>
  )
}
