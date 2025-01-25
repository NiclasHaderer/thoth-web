import { UUID } from "@thoth/client"
import { useAudiobookState } from "@thoth/state/audiobook.state"
import { AudiobookSelectors } from "@thoth/state/audiobook.selectors"
import { useRef } from "react"
import { useScrollTo } from "@thoth/hooks/scroll-to-top"
import { useInfinityScroll } from "@thoth/hooks/infinity-scroll"
import { ResponsiveGrid } from "@thoth/components/responsive-grid"
import { CleanIfNotVisible } from "@thoth/components/clean-if-not-visible"
import { AuthorDisplay } from "@thoth/components/author/author-display"

export const AuthorListOutlet = ({ libraryId }: { libraryId: UUID }) => {
  const getAuthors = useAudiobookState(s => s.fetchAuthors)
  const loading = useRef<HTMLDivElement>(null)
  useScrollTo("main")
  useInfinityScroll(loading.current, index => getAuthors({ libraryId, offset: index }))

  const authors = useAudiobookState(AudiobookSelectors.selectAuthors(libraryId))
  const authorCount = useAudiobookState(AudiobookSelectors.selectAuthorCount(libraryId))
  return (
    <>
      {authorCount != null ? <h2 className="p-2 pb-6 text-2xl">{authorCount} Authors</h2> : null}
      <ResponsiveGrid>
        {authors.map((author, k) => (
          <CleanIfNotVisible key={k}>
            <AuthorDisplay {...author} />
          </CleanIfNotVisible>
        ))}
        <div className="min-w-full text-center opacity-0" ref={loading}>
          Loading ...
        </div>
      </ResponsiveGrid>
    </>
  )
}
