import { BookIcon, BookMarkedIcon, ChevronDownIcon, LibraryIcon, UserIcon } from "lucide-react"
import { FC, useEffect } from "react"
import { Button, MenuTrigger } from "react-aria-components"
import { UUID } from "@thoth/client"
import { NavItem } from "@thoth/components/menu/nav-item"
import { DropdownMenu, DropdownMenuItem } from "@thoth/components/ui/dropdown-menu"
import { AudiobookSelectors } from "@thoth/state/audiobook.selectors"
import { useAudiobookState } from "@thoth/state/audiobook.state"

export const LeftResourceMenu: FC<{ libraryId: UUID }> = ({ libraryId }) => {
  const libraries = useAudiobookState(AudiobookSelectors.libraries)
  const library = useAudiobookState(state => state.libraryMap[libraryId])
  const bookCount = useAudiobookState(AudiobookSelectors.selectBookCount(libraryId))
  const seriesCount = useAudiobookState(AudiobookSelectors.selectSeriesCount(libraryId))
  const authorCount = useAudiobookState(AudiobookSelectors.selectAuthorCount(libraryId))

  const fetchLibraries = useAudiobookState(s => s.fetchLibraries)
  const fetchBooks = useAudiobookState(s => s.fetchBooks)
  const fetchSeries = useAudiobookState(s => s.fetchSeries)
  const fetchAuthors = useAudiobookState(s => s.fetchAuthors)

  useEffect(() => {
    void fetchLibraries()
    void fetchBooks({ libraryId, offset: 0 })
    void fetchSeries({ libraryId, offset: 0 })
    void fetchAuthors({ libraryId, offset: 0 })
  }, [libraryId, fetchLibraries, fetchBooks, fetchSeries, fetchAuthors])

  const items = [
    { href: `/libraries/${libraryId}/books`, Icon: BookIcon, label: "Books", count: bookCount },
    { href: `/libraries/${libraryId}/series`, Icon: BookMarkedIcon, label: "Series", count: seriesCount },
    { href: `/libraries/${libraryId}/authors`, Icon: UserIcon, label: "Authors", count: authorCount },
  ]

  return (
    <aside className="bg-card my-10 ml-10 h-fit w-56 shrink-0 overflow-hidden rounded-xl p-2">
      {libraries.length > 1 ? (
        <MenuTrigger>
          <Button className="group hover:bg-muted focus-visible:bg-muted flex h-12 w-full cursor-pointer items-center gap-3 rounded-lg px-3 text-left transition-colors outline-none">
            <LibraryIcon className="text-muted-foreground size-4 shrink-0" />
            <span className="truncate text-sm font-medium">{library?.name ?? "Library"}</span>
            <ChevronDownIcon className="text-muted-foreground ml-auto size-4 shrink-0 transition-transform duration-200 group-aria-expanded:rotate-180" />
          </Button>
          <DropdownMenu placement="bottom start" className="w-56">
            {libraries.map(entry => (
              <DropdownMenuItem
                key={entry.id}
                className="gap-2.5 px-2.5 py-2 text-sm"
                href={`/libraries/${entry.id}/books`}
              >
                <LibraryIcon className="size-4" />
                {entry.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenu>
        </MenuTrigger>
      ) : (
        <div className="flex h-12 items-center gap-3 px-3">
          <LibraryIcon className="text-muted-foreground size-4 shrink-0" />
          <span className="truncate text-sm font-medium">{library?.name ?? "Library"}</span>
        </div>
      )}

      <ul className="border-border mt-2 flex flex-col gap-1 border-t pt-2">
        {items.map(item => (
          <li key={item.href}>
            <NavItem {...item} />
          </li>
        ))}
      </ul>
    </aside>
  )
}
