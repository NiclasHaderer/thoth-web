import { forwardRef } from "react"
import { MdImageNotSupported } from "react-icons/md"
import { Link } from "wouter"
import { BookModel } from "@thoth/client"

export const BookPreview = forwardRef<HTMLDivElement, BookModel>((book, ref) => {
  return (
    <div className="mx-6 mb-6 inline-block w-52" ref={ref}>
      <Link href={`/libraries/${book.library.id}/books/${book.id}`} aria-label={book.title} tabIndex={-1}>
        {book.coverID ? (
          <img
            className="h-52 w-52 cursor-pointer rounded-md border-2 border-transparent object-cover transition-colors hover:border-primary"
            src={`/api/stream/images/${book.coverID}`}
            alt={book.title}
            loading="lazy"
          />
        ) : (
          <MdImageNotSupported className="h-52 w-52 cursor-pointer rounded-md border-2 border-transparent transition-colors hover:border-primary" />
        )}
      </Link>

      <div className="relative p-2 text-center">
        <Link href={`/libraries/${book.library.id}/books/${book.id}`}>
          <span className="line-clamp-2 cursor-pointer hover:underline group-focus:underline">{book.title}</span>
        </Link>
        {book.authors.map(author => (
          <Link href={`/libraries/${book.library.id}/authors/${author.id}`} key={author.id}>
            <span className="cursor-pointer text-font-secondary hover:underline group-focus:underline">
              {author.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
})
