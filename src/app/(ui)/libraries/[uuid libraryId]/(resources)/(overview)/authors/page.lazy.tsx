import { FC, useRef, useState } from "react"
import { Order, UUID } from "@thoth/client"
import { AuthorPreview } from "@thoth/components/author/author-preview.tsx"
import { ClearIfNotVisible } from "@thoth/components/clear-if-not-visible.tsx"
import { ResourceListHeader } from "@thoth/components/resource-list-header"
import { ResponsiveGrid } from "@thoth/components/responsive-grid"
import { useInfinityScroll } from "@thoth/hooks/infinity-scroll"
import { useScrollTo } from "@thoth/hooks/scroll-to-top"
import { useAuthors } from "@thoth/queries/resources"
import { pluralize } from "@thoth/utils/utils"

const AuthorGrid: FC<{ libraryId: UUID; order: Order }> = ({ libraryId, order }) => {
  const loading = useRef<HTMLDivElement>(null)
  useScrollTo("main")
  const { items: authors, fetchNextPage, hasNextPage, isFetchingNextPage } = useAuthors(libraryId, order)
  useInfinityScroll(loading, fetchNextPage, hasNextPage && !isFetchingNextPage)

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
  const { total } = useAuthors(libraryId, order)

  return (
    <>
      <ResourceListHeader
        title="Authors"
        subtitle={pluralize(total, "author")}
        order={order}
        onOrderChange={setOrder}
      />
      <AuthorGrid key={order} libraryId={libraryId} order={order} />
    </>
  )
}
