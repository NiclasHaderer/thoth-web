import React from "react"
import { MdImageNotSupported } from "react-icons/md"
import Link from "next/link"

interface CollectionProps {
  id: string
  amount?: number
  title: string
  cover?: string
}

export const SeriesDisplay: React.VFC<CollectionProps> = ({ id, title, amount, cover }) => {
  return (
    <span className="mx-6 mb-6 inline-block w-52 ">
      <Link href={`/series/${id}`} aria-label={title} tabIndex={-1}>
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
      </Link>

      <div className="relative p-2 text-center">
        <Link href={`/series/${id}`}>
          <span className="line-clamp-2 cursor-pointer hover:underline  no-touch:group-focus:underline">{title}</span>
        </Link>
        <span className="text-unimportant">{amount} Audiobooks</span>
      </div>
    </span>
  )
}
