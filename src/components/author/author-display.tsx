import { FC } from "react"
import Link from "next/link"
import { MdPerson } from "react-icons/md"
import { useAudiobookState } from "@thoth/state/audiobook.state"
import { AudiobookSelectors } from "@thoth/state/audiobook.selectors"

interface AuthorProps {
  id: string
  name: string
  imageID?: string
  className?: string
}

export const AuthorDisplay: FC<AuthorProps> = ({ imageID, name, id, className }) => {
  const libraryId = useAudiobookState(AudiobookSelectors.selectedLibraryId)
  return (
    <div className={`mx-6 mb-6 inline-block w-52 min-w-52 ${className}`}>
      <Link href={`/libraries/${libraryId}/authors/${id}`} aria-label={name} tabIndex={-1}>
        {imageID ? (
          <img
            loading="lazy"
            className="h-52 w-52 cursor-pointer rounded-full border-2 border-active-light object-cover transition-colors hover:border-primary"
            src={`(/api/stream/images/${imageID}`}
            alt="Author"
          />
        ) : (
          <MdPerson className="h-52 w-52 cursor-pointer rounded-full border-2 border-transparent transition-colors hover:border-primary" />
        )}
      </Link>

      <div className="relative p-2 text-center">
        <Link href={`/libraries/${libraryId}/authors/${id}`}>
          <span className="cursor-pointer hover:underline group-focus:underline">{name}</span>
        </Link>
      </div>
    </div>
  )
}
