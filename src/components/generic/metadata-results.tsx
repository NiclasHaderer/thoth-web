import { Fragment, ReactNode } from "react"

export const MetadataResults = <T,>({
  results,
  onSelect,
  title,
  description,
  image,
}: {
  results: T[]
  onSelect: (result: T) => void
  title: (result: T) => string | undefined
  description: (result: T) => string | undefined
  image?: (result: T) => ReactNode
}) => (
  <>
    {results.length === 0 ? <div>Nothing was found</div> : null}
    {results.map((result, i) => (
      <Fragment key={i}>
        <div
          onClick={() => onSelect(result)}
          className="hover:bg-muted focus:bg-muted flex cursor-pointer items-stretch justify-between rounded-md p-2 transition-colors"
          tabIndex={0}
        >
          <div>
            <h3 className="pr-2 pb-2 text-xl">{title(result) || "Unknown"}</h3>
            <p className="line-clamp-4 pr-2">{description(result)}</p>
          </div>
          {image?.(result) ?? null}
        </div>
        {results.length - 1 !== i ? <hr className="border-border my-4" /> : null}
      </Fragment>
    ))}
  </>
)
