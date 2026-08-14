import { BookIcon, BookMarkedIcon, HomeIcon, LucideIcon, MicIcon, TagsIcon, UserIcon } from "lucide-react"
import { UUID } from "@thoth/client"
import { AudiobookSelectors } from "@thoth/state/audiobook.selectors"
import { useAudiobookState } from "@thoth/state/audiobook.state"

export type LibraryDestination = {
  href: string
  Icon: LucideIcon
  label: string
  count?: number
  exact?: boolean
}

export const useLibraryDestinations = (libraryId: UUID): LibraryDestination[] => {
  const bookCount = useAudiobookState(AudiobookSelectors.selectBookCount(libraryId))
  const seriesCount = useAudiobookState(AudiobookSelectors.selectSeriesCount(libraryId))
  const authorCount = useAudiobookState(AudiobookSelectors.selectAuthorCount(libraryId))

  return [
    { href: `/libraries/${libraryId}`, Icon: HomeIcon, label: "Home", exact: true },
    { href: `/libraries/${libraryId}/books`, Icon: BookIcon, label: "Books", count: bookCount },
    { href: `/libraries/${libraryId}/series`, Icon: BookMarkedIcon, label: "Series", count: seriesCount },
    { href: `/libraries/${libraryId}/authors`, Icon: UserIcon, label: "Authors", count: authorCount },
    { href: `/libraries/${libraryId}/narrators`, Icon: MicIcon, label: "Narrators" },
    { href: `/libraries/${libraryId}/genres`, Icon: TagsIcon, label: "Genres" },
  ]
}
