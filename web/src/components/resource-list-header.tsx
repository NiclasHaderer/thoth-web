import { ArrowDownAZIcon, ArrowDownZAIcon } from "lucide-react"
import { FC } from "react"
import { Order } from "@thoth/client"
import { Button } from "@thoth/components/ui/button"

export const ResourceListHeader: FC<{ title: string; order: Order; onOrderChange: (order: Order) => void }> = ({
  title,
  order,
  onOrderChange,
}) => (
  <div className="mb-4 flex items-center justify-between gap-3">
    <h2 className="text-2xl">{title}</h2>
    <Button
      variant="ghost"
      size="sm"
      aria-label={order === "ASC" ? "Sort descending" : "Sort ascending"}
      onPress={() => onOrderChange(order === "ASC" ? "DESC" : "ASC")}
    >
      {order === "ASC" ? <ArrowDownAZIcon /> : <ArrowDownZAIcon />}
      {order === "ASC" ? "A-Z" : "Z-A"}
    </Button>
  </div>
)
