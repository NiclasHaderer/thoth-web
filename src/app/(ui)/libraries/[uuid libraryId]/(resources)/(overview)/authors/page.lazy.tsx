import { FC, useRef, useState } from "react"
import { Order, UUID } from "@thoth/client"
import { AuthorPreview } from "@thoth/components/author/author-preview.tsx"
import { ClearIfNotVisible } from "@thoth/components/clear-if-not-visible.tsx"
import { ResourceListHeader } from "@thoth/components/resource-list-header"
import { ResponsiveGrid } from "@thoth/components/responsive-grid"
import { useInfinityScroll } from "@thoth/hooks/infinity-scroll"
import { useScrollTo } from "@thoth/hooks/scroll-to-top"
import { AudiobookSelectors } from "@thoth/state/audiobook.selectors"
import { useAudiobookState } from "@thoth/state/audiobook.state"
import { pluralize } from "@thoth/utils/utils"

const AuthorGrid: FC<{ libraryId: UUID; order: Order }> = ({ libraryId, order }) => {
  const getAuthors = useAudiobookState(s => s.fetchAuthors)
  const loading = useRef<HTMLDivElement>(null)
  useScrollTo("main")
  useInfinityScroll(loading, offset => getAuthors({ libraryId, offset, order }))
  const authors = useAudiobookState(AudiobookSelectors.selectAuthors(libraryId))

  return (
    <ResponsiveGrid>
      {authors.map((author, k) => (
        <ClearIfNotVisible key={k} component={AuthorPreview} childProps={author} />
      ))}
      <div className="col-span-full text-center opacity-0" ref={loading}>
        Loading ...
      </div>
    </ResponsiveGrid>
  )
}

export const AuthorListOutlet = ({ libraryId }: { libraryId: UUID }) => {
  const [order, setOrder] = useState<Order>("ASC")
  const clearAuthors = useAudiobookState(s => s.clearAuthor)
  const authorCount = useAudiobookState(AudiobookSelectors.selectAuthorCount(libraryId))

  return (
    <>
      <ResourceListHeader
        title="Authors"
        subtitle={pluralize(authorCount, "author")}
        order={order}
        onOrderChange={next => {
          clearAuthors(libraryId)
          setOrder(next)
        }}
      />
      <AuthorGrid key={order} libraryId={libraryId} order={order} />
    </>
  )
}
