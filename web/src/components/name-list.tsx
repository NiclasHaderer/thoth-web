import { ChevronRightIcon } from "lucide-react"
import { FC, useState } from "react"
import { Link } from "wouter"
import { Order, UUID } from "@thoth/client"
import { ResourceGrid } from "@thoth/components/resource-grid"
import { ResourceListHeader } from "@thoth/components/resource-list-header"
import { Skeleton } from "@thoth/components/ui/skeleton"
import { rowInteraction } from "@thoth/lib/interactive"
import { cn } from "@thoth/lib/utils"
import { NameListCall, NameListResource, useNameList } from "@thoth/queries/name-lists"
import { pluralize } from "@thoth/utils/utils"

const LIST_CLASSES =
  "md:grid md:grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] md:gap-4 xl:grid-cols-[repeat(auto-fill,minmax(13rem,1fr))]"

const ROW_CLASSES =
  "-mx-2 flex h-14 items-center gap-3 px-2 md:mx-0 md:h-auto md:flex-col md:items-start md:gap-1 md:rounded-xl md:p-4"

interface NameListProps {
  libraryId: UUID
  resource: NameListResource
  title: string
  unit: string
  unitPlural?: string
  basePath: string
  list: NameListCall
}

const NameItems: FC<NameListProps & { order: Order; onOrderChange: (order: Order) => void }> = props => {
  const { unit, unitPlural, basePath, order } = props
  const query = useNameList(props.resource, props.list, props.libraryId, order)

  return (
    <>
      <ResourceListHeader
        title={props.title}
        subtitle={pluralize(query.total, unit, unitPlural)}
        order={order}
        onOrderChange={props.onOrderChange}
      />

      <ResourceGrid
        role="list"
        listKey={query.listKey}
        total={query.total}
        itemAt={query.itemAt}
        loading={query.loading}
        onRangeChange={query.onRangeChange}
        listClassName={LIST_CLASSES}
        renderItem={(item, index) => (
          <div role="listitem">
            <Link
              href={`${basePath}/${encodeURIComponent(item.name)}`}
              className={cn(
                rowInteraction,
                "border-border",
                ROW_CLASSES,
                index === query.total - 1 ? null : "border-b md:border-b-0",
                "md:bg-card md:border"
              )}
            >
              <span className="truncate text-sm font-medium md:w-full md:text-base">{item.name}</span>
              <span className="text-muted-foreground ml-auto shrink-0 text-sm tabular-nums md:ml-0">
                {pluralize(item.bookCount, "book")}
              </span>
              <ChevronRightIcon aria-hidden className="text-muted-foreground size-4 shrink-0 md:hidden" />
            </Link>
          </div>
        )}
        renderPlaceholder={() => (
          <div aria-busy className={cn("border-border", ROW_CLASSES, "border-b md:border md:border-b-0")}>
            <Skeleton className="h-5 w-32 md:h-6 md:w-full" />
            <Skeleton className="ml-auto h-5 w-16 md:ml-0" />
          </div>
        )}
      />

      {!query.loading && query.total === 0 ? (
        <p className="text-muted-foreground mt-12 text-center text-sm">{`No ${unitPlural ?? `${unit}s`} yet`}</p>
      ) : null}
    </>
  )
}

export const NameList: FC<NameListProps> = props => {
  const [order, setOrder] = useState<Order>("ASC")
  return <NameItems key={order} {...props} order={order} onOrderChange={setOrder} />
}
