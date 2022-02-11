import React from "react"

export const LoadingCards: React.VFC<{ amount: number }> = ({ amount }) => (
  <>
    {new Array(amount).fill(null).map((_, i) => (
      <LoadingCard key={i} />
    ))}
  </>
)
export const LoadingCard: React.VFC = () => (
  <div className="mx-auto w-full rounded-md p-4">
    <div className="flex animate-pulse space-x-4">
      <div className="h-10 w-10 rounded-full bg-slate-200" />
      <div className="flex-1 space-y-6 py-1">
        <div className="h-2 rounded bg-slate-200" />
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 h-2 rounded bg-slate-200" />
            <div className="col-span-1 h-2 rounded bg-slate-200" />
          </div>
          <div className="h-2 rounded bg-slate-200" />
        </div>
      </div>
    </div>
  </div>
)
