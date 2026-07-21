import { FC } from "react"

export const Loading: FC<{ count: number }> = ({ count }) => {
  return (
    <>
      {new Array(count).fill(0).map((_, i) => (
        <div className="bg-popover mx-auto my-2 w-full rounded-md p-4" key={i}>
          <div className="flex animate-pulse space-x-4">
            <div className="bg-accent size-10 rounded-full"></div>
            <div className="flex-1 space-y-6 py-1">
              <div className="bg-accent h-2 rounded"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-accent col-span-2 h-2 rounded"></div>
                  <div className="bg-accent col-span-1 h-2 rounded"></div>
                </div>
                <div className="bg-accent h-2 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}
