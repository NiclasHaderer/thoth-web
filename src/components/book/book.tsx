import React from "react"
import { MdImageNotSupported } from "react-icons/md"
import { NamedId } from "@thoth/models/api-models"
import Link from "next/link"
import { environment } from "@thoth/environment"

interface BookProps {
  id: string
  coverID?: string | null
  authors: NamedId[]
  title: string
}

export const BookDisplay: React.FC<BookProps> = ({ coverID, title, authors, id }) => {
  return (
    <div className="mx-6 mb-6 inline-block w-52">
      <Link href={`/books/${id}`} aria-label={title} tabIndex={-1}>
        {coverID ? (
          <img
            className="h-52 w-52 cursor-pointer rounded-md border-2 border-transparent object-cover transition-colors hover:border-primary"
            src={`${environment.apiURL}/image/${coverID}`}
            alt={title}
            loading="lazy"
          />
        ) : (
          <MdImageNotSupported className="h-52 w-52 cursor-pointer rounded-md border-2 border-transparent transition-colors hover:border-primary" />
        )}
      </Link>

      <div className="relative p-2 text-center">
        <Link href={`/books/${id}`}>
          <span className="line-clamp-2 cursor-pointer hover:underline group-focus:underline ">{title}</span>
        </Link>
        {authors.map(author => (
          <Link href={`/authors/${author.id}`} key={author.id}>
            <span className="cursor-pointer text-unimportant  hover:underline group-focus:underline">
              {author.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}