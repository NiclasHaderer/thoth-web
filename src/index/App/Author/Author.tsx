import React from "react"
import { MdPerson } from "react-icons/md"

import { environment } from "../../env"
import { ALink } from "../Common/ActiveLink"

interface AuthorProps {
  imageID: string | null
  name: string
  id: string
  className?: string
}

export const Author: React.VFC<AuthorProps> = ({ imageID, name, id, className }) => {
  return (
    <div className={`mx-6 mb-6 inline-block w-52 min-w-52 ${className}`}>
      <ALink href={`/authors/${id}`} aria-label={name} tabIndex={-1}>
        {imageID ? (
          <img
            loading="lazy"
            className="h-52 w-52 cursor-pointer  rounded-full border-2 border-active-light object-cover transition-colors hover:border-primary"
            src={`${environment.apiURL}/image/${imageID}`}
            alt="Author"
          />
        ) : (
          <MdPerson className="h-52 w-52 cursor-pointer rounded-full border-2 border-transparent transition-colors hover:border-primary" />
        )}
      </ALink>

      <div className="relative p-2 text-center">
        <ALink href={`/authors/${id}`}>
          <span className="cursor-pointer hover:underline group-focus:underline">{name}</span>
        </ALink>
      </div>
    </div>
  )
}
