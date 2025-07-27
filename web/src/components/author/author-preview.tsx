import { forwardRef } from "react"
import { MdPerson } from "react-icons/md"
import { Link } from "wouter"
import { AuthorModel } from "@thoth/client"

interface AuthorProps extends AuthorModel {
  className?: string
}

export const AuthorPreview = forwardRef<HTMLDivElement, AuthorProps>(({ className, ...author }, ref) => {
  return (
    <div className={`mx-6 mb-6 inline-block w-52 min-w-52 ${className}`} ref={ref}>
      <Link href={`/libraries/${author.library.id}/authors/${author.id}`} aria-label={author.name} tabIndex={-1}>
        {author.imageID ? (
          <img
            loading="lazy"
            className="h-52 w-52 cursor-pointer rounded-full border-2 border-active-light object-cover transition-colors hover:border-primary"
            src={`(/api/stream/images/${author.imageID}`}
            alt="Author"
          />
        ) : (
          <MdPerson className="h-52 w-52 cursor-pointer rounded-full border-2 border-transparent transition-colors hover:border-primary" />
        )}
      </Link>

      <div className="relative p-2 text-center">
        <Link href={`/libraries/${author.library.id}/authors/${author.id}`}>
          <span className="cursor-pointer hover:underline group-focus:underline">{author.name}</span>
        </Link>
      </div>
    </div>
  )
})
