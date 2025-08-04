import { useRef } from "react"
import { UUID } from "@thoth/client"
import { AuthorPreview } from "@thoth/components/author/author-preview.tsx"
import { ClearIfNotVisible } from "@thoth/components/clear-if-not-visible.tsx"
import { ResponsiveGrid } from "@thoth/components/responsive-grid"
import { useInfinityScroll } from "@thoth/hooks/infinity-scroll"
import { useScrollTo } from "@thoth/hooks/scroll-to-top"
import { AudiobookSelectors } from "@thoth/state/audiobook.selectors"
import { useAudiobookState } from "@thoth/state/audiobook.state"

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
          <ClearIfNotVisible key={k} component={AuthorPreview} childProps={author} />
        ))}
        <div className="min-w-full text-center opacity-0" ref={loading}>
          Loading ...
        </div>
      </ResponsiveGrid>
    </>
  )
}
