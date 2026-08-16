import { Order, UUID } from "@/client"
import { AuthorPreview } from "@/components/author/author-preview.tsx"
import { ClearIfNotVisible } from "@/components/clear-if-not-visible.tsx"
import { ResourceListHeader } from "@/components/resource-list-header.tsx"
import { ResponsiveGrid } from "@/components/responsive-grid.tsx"
import { useInfinityScroll } from "@/hooks/infinity-scroll.ts"
import { useScrollTo } from "@/hooks/scroll-to-top.ts"
import { useAuthors } from "@/queries/resources.ts"
import { pluralize } from "@/utils/utils.ts"
import { FC, useRef, useState } from "react"

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
