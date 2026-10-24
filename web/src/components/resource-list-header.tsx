import { ArrowDownAZIcon, ArrowDownZAIcon } from "lucide-react"
import { FC } from "react"
import { Order } from "@dewey/client"
import { Button } from "@dewey/components/ui/button"

export const ResourceListHeader: FC<{
  title: string
  subtitle?: string
  order?: Order
  onOrderChange?: (order: Order) => void
}> = ({ title, subtitle, order, onOrderChange }) => (
  <div className="mb-4 flex items-end justify-between gap-3">
    <div className="min-w-0">
      <h2 className="hidden truncate text-2xl font-bold md:block">{title}</h2>
      {subtitle ? <p className="text-muted-foreground text-xs md:text-sm">{subtitle}</p> : null}
    </div>
    {order && onOrderChange ? (
      <Button
        variant="ghost"
        size="sm"
        aria-label={order === "ASC" ? "Sort descending" : "Sort ascending"}
        onPress={() => onOrderChange(order === "ASC" ? "DESC" : "ASC")}
      >
        {order === "ASC" ? <ArrowDownAZIcon /> : <ArrowDownZAIcon />}
        {order === "ASC" ? "A-Z" : "Z-A"}
      </Button>
    ) : null}
  </div>
)
