import React from "react"
import { MdImageNotSupported } from "react-icons/md"

import { NamedId } from "../../API/models/Audiobook"
import { environment } from "../../env"
import { ALink } from "../Common/ActiveLink"

interface BookProps {
  id: string
  cover: string | null
  title: string
  author: NamedId
}

export const Book: React.VFC<BookProps> = ({ cover, title, author, id }) => {
  return (
    <div className="mx-6 mb-6 inline-block w-52">
      <ALink href={`/books/${id}`} aria-label={title} tabIndex={-1}>
        {cover ? (
          <img
            className="h-52 w-52 cursor-pointer rounded-md border-2 border-transparent object-cover transition-colors hover:border-primary"
            src={`${environment.apiURL}/image/${cover}`}
            alt={title}
            loading="lazy"
          />
        ) : (
          <MdImageNotSupported className="h-52 w-52 cursor-pointer rounded-md border-2 border-transparent transition-colors hover:border-primary" />
        )}
      </ALink>

      <div className="relative p-2 text-center">
        <ALink href={`/books/${id}`}>
          <span className="cursor-pointer line-clamp-2 hover:underline group-focus:underline ">{title}</span>
        </ALink>
        <ALink href={`/authors/${author.id}`}>
          <span className="cursor-pointer text-unimportant  hover:underline group-focus:underline">{author.name}</span>
        </ALink>
      </div>
    </div>
  )
}
