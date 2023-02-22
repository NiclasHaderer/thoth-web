import React, { useRef } from "react"
import { useInfinityScroll } from "../../hooks/infinity-scroll"
import { useScrollTo } from "../../hooks/scroll-to-top"
import { AudiobookSelectors } from "../../state/audiobook.selectors"
import { useAudiobookState } from "../../state/audiobook.state"
import { CleanIfNotVisible } from "../common/clean-if-not-visible"
import { ResponsiveGrid } from "../common/responsive-grid"
import { Author } from "./author"

export const AuthorList: React.VFC = () => {
  const getAuthors = useAudiobookState(AudiobookSelectors.fetchAuthors)
  const loading = useRef<HTMLDivElement>(null)
  useScrollTo("main")
  useInfinityScroll(loading.current, getAuthors)

  const authors = useAudiobookState(AudiobookSelectors.selectAuthors)
  const authorCount = useAudiobookState(AudiobookSelectors.selectAuthorCount)
  return (
    <>
      {authorCount != null ? <h2 className="p-2 pb-6 text-2xl">{authorCount} Authors</h2> : null}
      <ResponsiveGrid>
        {authors.map((author, k) => (
          <CleanIfNotVisible key={k}>
            <Author {...author} />
          </CleanIfNotVisible>
        ))}
        <div className="min-w-full text-center opacity-0" ref={loading}>
          Loading ...
        </div>
      </ResponsiveGrid>
    </>
  )
}
export default AuthorList
