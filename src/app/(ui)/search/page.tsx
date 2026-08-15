import { SearchIcon } from "lucide-react"
import { Link } from "wouter"
import { Logo } from "@thoth/components/icons/logo"
import { Input } from "@thoth/components/input/input"
import { SearchResults } from "@thoth/components/menu/search-results"
import { useLibrarySearch } from "@thoth/queries/library-search"

// TODO: add recent searches
export const SearchOutlet = () => {
  const { query, setQuery, result } = useLibrarySearch(150)

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-3xl flex-col px-5 pb-[var(--dock-height,3.5rem)] md:pb-4">
      <div className="bg-background/75 sticky top-0 z-10 -mx-5 flex items-center gap-2 px-5 pt-4 pb-3 backdrop-blur-xl">
        <Link href="/libraries" aria-label="Thoth home" className="shrink-0 outline-none md:hidden">
          <Logo className="h-8 w-auto" />
        </Link>
        <div className="min-w-0 grow">
          <Input
            hideError
            autoFocus
            groupClassName="bg-popover dark:bg-popover rounded-3xl! h-auto py-1 border-0"
            leftIcon={<SearchIcon className="mx-1 size-5" />}
            placeholder="Search all libraries"
            value={query}
            onValue={setQuery}
          />
        </div>
      </div>

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
