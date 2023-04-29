import { FC } from "react"
import Link from "next/link"
import { environment } from "@thoth/environment"
import { MdPerson } from "react-icons/md"

interface AuthorProps {
  id: string
  name: string
  imageID?: string
  className?: string
}

export const AuthorDisplay: FC<AuthorProps> = ({ imageID, name, id, className }) => {
  return (
    <div className={`mx-6 mb-6 inline-block w-52 min-w-52 ${className}`}>
      <Link href={`/authors/${id}`} aria-label={name} tabIndex={-1}>
        {imageID ? (
          <img
            loading="lazy"
            className="h-52 w-52 cursor-pointer  rounded-full border-2 border-active-light object-cover transition-colors hover:border-primary"
            src={`(/api/image/${imageID}`}
            alt="Author"
          />
        ) : (
          <MdPerson className="h-52 w-52 cursor-pointer rounded-full border-2 border-transparent transition-colors hover:border-primary" />
        )}
      </Link>

      <div className="relative p-2 text-center">
        <Link href={`/authors/${id}`}>
          <span className="cursor-pointer hover:underline group-focus:underline">{name}</span>
        </Link>
      </div>
    </div>
  )
}
