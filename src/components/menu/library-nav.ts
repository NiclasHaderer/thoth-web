import { BookIcon, BookMarkedIcon, HomeIcon, LucideIcon, MicIcon, TagsIcon, UserIcon } from "lucide-react"
import { UUID } from "@thoth/client"

export type LibraryDestination = {
  href: string
  Icon: LucideIcon
  label: string
  exact?: boolean
}

export const libraryDestinations = (libraryId: UUID): LibraryDestination[] => [
  { href: `/libraries/${libraryId}`, Icon: HomeIcon, label: "Home", exact: true },
  { href: `/libraries/${libraryId}/books`, Icon: BookIcon, label: "Books" },
  { href: `/libraries/${libraryId}/series`, Icon: BookMarkedIcon, label: "Series" },
  { href: `/libraries/${libraryId}/authors`, Icon: UserIcon, label: "Authors" },
  { href: `/libraries/${libraryId}/narrators`, Icon: MicIcon, label: "Narrators" },
  { href: `/libraries/${libraryId}/genres`, Icon: TagsIcon, label: "Genres" },
]
