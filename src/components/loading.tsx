import { FC } from "react"

export const Loading: FC<{ count: number }> = ({ count }) => {
  return (
    <>
      {new Array(count).fill(0).map((_, i) => (
        <div className="mx-auto my-2 w-full rounded-md bg-elevate-2 p-4" key={i}>
          <div className="flex animate-pulse space-x-4">
            <div className="size-10 rounded-full bg-active"></div>
            <div className="flex-1 space-y-6 py-1">
              <div className="h-2 rounded bg-active"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 h-2 rounded bg-active"></div>
                  <div className="col-span-1 h-2 rounded bg-active"></div>
                </div>
                <div className="h-2 rounded bg-active"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}
