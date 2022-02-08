import React from "react"
import { MdImageNotSupported } from "react-icons/md"

import { ALink } from "../Common/ActiveLink"

interface CollectionProps {
  id: string
  amount?: number
  title: string
  cover?: string
}

export const Series: React.VFC<CollectionProps> = ({ id, title, amount, cover }) => {
  return (
    <span className="mx-6 mb-6 inline-block w-52 ">
      <ALink href={`/series/${id}`} aria-label={title} tabIndex={-1}>
        {cover ? (
          <img
            loading="lazy"
            className="h-52 w-52 cursor-pointer rounded-md border-2 border-transparent transition-colors hover:border-primary"
            src={cover}
            alt="Series"
          />
        ) : (
          <MdImageNotSupported className="h-52 w-52 cursor-pointer rounded-md border-2 border-transparent transition-colors hover:border-primary" />
        )}
      </ALink>

      <div className="relative p-2 text-center">
        <ALink href={`/series/${id}`}>
          <span className="cursor-pointer line-clamp-2 hover:underline  no-touch:group-focus:underline">{title}</span>
        </ALink>
        <span className="text-unimportant">{amount} Audiobooks</span>
      </div>
    </span>
  )
}
