import {
  ArrowDownToLineIcon,
  BookIcon,
  BookMarkedIcon,
  HomeIcon,
  LucideIcon,
  MicIcon,
  TagsIcon,
  UserIcon,
} from "lucide-react"
import { UUID } from "@dewey/client"

export type LibraryDestination = {
  href: string
  Icon: LucideIcon
  label: string
  exact?: boolean
}

// Without a library (list still loading, or none exist) every link falls back to /libraries, which redirects once
// the list is known, so menus keep their final shape instead of growing in.
export const libraryDestinations = (libraryId: UUID | undefined): LibraryDestination[] => {
  const href = (path: string) => (libraryId ? `/libraries/${libraryId}${path}` : "/libraries")
  return [
    { href: href(""), Icon: HomeIcon, label: "Home", exact: true },
    { href: href("/books"), Icon: BookIcon, label: "Books" },
    { href: href("/series"), Icon: BookMarkedIcon, label: "Series" },
    { href: href("/authors"), Icon: UserIcon, label: "Authors" },
    { href: href("/narrators"), Icon: MicIcon, label: "Narrators" },
    { href: href("/genres"), Icon: TagsIcon, label: "Genres" },
  ]
}

export const browseDestinations = (libraryId: UUID | undefined) =>
  libraryDestinations(libraryId).filter(destination => !destination.exact)

export const downloadsDestination: LibraryDestination = {
  href: "/downloads",
  Icon: ArrowDownToLineIcon,
  label: "Downloads",
}
