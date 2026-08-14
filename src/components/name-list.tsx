import { ChevronRightIcon } from "lucide-react"
import { FC, useRef, useState } from "react"
import { Link } from "wouter"
import { Order, UUID } from "@thoth/client"
import { ResourceListHeader } from "@thoth/components/resource-list-header"
import { Skeleton } from "@thoth/components/ui/skeleton"
import { useInfinityScroll } from "@thoth/hooks/infinity-scroll"
import { useScrollTo } from "@thoth/hooks/scroll-to-top"
import { rowInteraction } from "@thoth/lib/interactive"
import { cn } from "@thoth/lib/utils"
import { NameListCall, NameListResource, useNameList } from "@thoth/queries/name-lists"
import { pluralize } from "@thoth/utils/utils"

interface NameListProps {
  libraryId: UUID
  resource: NameListResource
  title: string
  unit: string
  unitPlural?: string
  basePath: string
  list: NameListCall
}

const NameItems: FC<NameListProps & { order: Order }> = props => {
  const { unit, unitPlural, basePath, order } = props
  const sentinel = useRef<HTMLDivElement>(null)
  useScrollTo("main")

  const query = useNameList(props.resource, props.list, props.libraryId, order)
  useInfinityScroll(sentinel, query.fetchNextPage, query.hasNextPage && !query.isFetchingNextPage)

  const items = query.data?.pages.flatMap(page => page.items) ?? []
  const loading = query.isFetching
  const empty = !loading && items.length === 0

  return (
    <>
      <ul
        aria-busy={loading}
        className="divide-border divide-y md:grid md:grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] md:gap-4 md:divide-y-0 xl:grid-cols-[repeat(auto-fill,minmax(13rem,1fr))]"
      >
        {items.map(item => (
          <li key={item.name}>
            <Link
              href={`${basePath}/${encodeURIComponent(item.name)}`}
              className={cn(
                rowInteraction,
                "-mx-2 flex h-14 items-center gap-3 px-2",
                "md:border-border md:bg-card md:mx-0 md:h-auto md:flex-col md:items-start md:gap-1 md:rounded-xl md:border md:p-4"
              )}
            >
              <span className="truncate text-sm font-medium md:w-full md:text-base">{item.name}</span>
              <span className="text-muted-foreground ml-auto shrink-0 text-sm tabular-nums md:ml-0">
                {pluralize(item.bookCount, "book")}
              </span>
              <ChevronRightIcon aria-hidden className="text-muted-foreground size-4 shrink-0 md:hidden" />
            </Link>
          </li>
        ))}

        {loading
          ? Array.from({ length: 6 }, (_, index) => (
              <li key={`skeleton-${index}`}>
                <Skeleton className="my-2 h-10 md:h-24" />
              </li>
            ))
          : null}
      </ul>

      {empty ? (
        <p className="text-muted-foreground mt-12 text-center text-sm">{`No ${unitPlural ?? `${unit}s`} yet`}</p>
      ) : null}

      <div aria-hidden className="h-1" ref={sentinel} />
    </>
  )
}

export const NameList: FC<NameListProps> = props => {
  const [order, setOrder] = useState<Order>("ASC")
  const total = useNameList(props.resource, props.list, props.libraryId, order).data?.pages[0]?.total

  return (
    <>
      <ResourceListHeader
        title={props.title}
        subtitle={pluralize(total ?? 0, props.unit, props.unitPlural)}
        order={order}
        onOrderChange={setOrder}
      />
      <NameItems key={order} {...props} order={order} />
    </>
  )
}
