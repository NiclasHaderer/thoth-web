import React from "react"
import { MdImageNotSupported } from "react-icons/md"
import { BookModel, NamedId } from "@thoth/client"
import Link from "next/link"
import { useAudiobookState } from "@thoth/state/audiobook.state"
import { AudiobookSelectors } from "@thoth/state/audiobook.selectors"

export const BookDisplay: React.FC<BookModel> = ({ coverID, title, authors, id }) => {
  const libraryId = useAudiobookState(AudiobookSelectors.selectedLibraryId)

  return (
    <div className="mx-6 mb-6 inline-block w-52">
      <Link href={`/libraries/${libraryId}/books/${id}`} aria-label={title} tabIndex={-1}>
        {coverID ? (
          <img
            className="h-52 w-52 cursor-pointer rounded-md border-2 border-transparent object-cover transition-colors hover:border-primary"
            src={`/api/stream/images/${coverID}`}
            alt={title}
            loading="lazy"
          />
        ) : (
          <MdImageNotSupported className="h-52 w-52 cursor-pointer rounded-md border-2 border-transparent transition-colors hover:border-primary" />
        )}
      </Link>

      <div className="relative p-2 text-center">
        <Link href={`/libraries/${libraryId}/books/${id}`}>
          <span className="line-clamp-2 cursor-pointer hover:underline group-focus:underline ">{title}</span>
        </Link>
        {authors.map(author => (
          <Link href={`/libraries/${libraryId}/authors/${author.id}`} key={author.id}>
            <span className="cursor-pointer text-font-secondary  hover:underline group-focus:underline">
              {author.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
