import { FC } from "react"

export const LoadingCards: FC<{ amount: number }> = ({ amount }) => (
  <>
    {new Array(amount).fill(null).map((_, i) => (
      <LoadingCard key={i} />
    ))}
  </>
)
export const LoadingCard: FC = () => (
  <div className="mx-auto w-full rounded-md p-4">
    <div className="flex animate-pulse space-x-4">
      <div className="bg-accent h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-6 py-1">
        <div className="bg-accent h-2 rounded" />
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-accent col-span-2 h-2 rounded" />
            <div className="bg-accent col-span-1 h-2 rounded" />
          </div>
          <div className="bg-accent h-2 rounded" />
        </div>
      </div>
    </div>
  </div>
)
