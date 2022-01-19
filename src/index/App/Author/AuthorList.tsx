import React, { useRef } from "react"
import { useInfinityScroll } from "../../Hooks/InfinityScroll"
import { useScrollToTop } from "../../Hooks/ScrollToTop"
import { AudiobookSelectors } from "../../State/Audiobook.Selectors"
import { useAudiobookState } from "../../State/Audiobook.State"
import { ResponsiveGrid } from "../Common/ResponsiveGrid"
import { Author } from "./Author"

export const AuthorList: React.VFC = () => {
  const getAuthors = useAudiobookState(AudiobookSelectors.fetchAuthors)
  const loading = useRef<HTMLDivElement>(null)
  useScrollToTop("main")
  useInfinityScroll(loading.current, getAuthors)

  const authors = useAudiobookState(AudiobookSelectors.selectAuthors)
  return (
    <ResponsiveGrid>
      {authors.map((author, k) => (
        <Author {...author} key={k} />
      ))}
      <div className="min-w-full text-center opacity-0" ref={loading}>
        Loading ...
      </div>
    </ResponsiveGrid>
  )
}
