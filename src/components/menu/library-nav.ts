import { BookIcon, BookMarkedIcon, HomeIcon, LucideIcon, MicIcon, TagsIcon, UserIcon } from "lucide-react"
import { UUID } from "@thoth/client"
import { useAuthors, useBooks, useSeriesList } from "@thoth/queries/resources"

export type LibraryDestination = {
  href: string
  Icon: LucideIcon
  label: string
  count?: number
  exact?: boolean
}

export const useLibraryDestinations = (libraryId: UUID): LibraryDestination[] => {
  const bookCount = useBooks(libraryId).total
  const seriesCount = useSeriesList(libraryId).total
  const authorCount = useAuthors(libraryId).total

  return [
    { href: `/libraries/${libraryId}`, Icon: HomeIcon, label: "Home", exact: true },
    { href: `/libraries/${libraryId}/books`, Icon: BookIcon, label: "Books", count: bookCount },
    { href: `/libraries/${libraryId}/series`, Icon: BookMarkedIcon, label: "Series", count: seriesCount },
    { href: `/libraries/${libraryId}/authors`, Icon: UserIcon, label: "Authors", count: authorCount },
    { href: `/libraries/${libraryId}/narrators`, Icon: MicIcon, label: "Narrators" },
    { href: `/libraries/${libraryId}/genres`, Icon: TagsIcon, label: "Genres" },
  ]
}
