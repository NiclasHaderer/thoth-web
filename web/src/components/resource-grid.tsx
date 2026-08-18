import { ReactNode, useCallback, useLayoutEffect, useState } from "react"
import { GridStateSnapshot, ListRange, VirtuosoGrid } from "react-virtuoso"
import { useLocation } from "wouter"
import { useScrollSurface } from "@thoth/components/scroll-surface"
import { readListScroll, writeListScroll } from "@thoth/state/list-scroll"

const LOADING_CELLS = 12

interface ResourceGridProps<T> {
  listKey: string
  total: number
  itemAt: (index: number) => T | undefined
  renderItem: (item: T, index: number) => ReactNode
  // Items whose page has not arrived yet. Must have a height, or the grid cannot measure a row.
  renderPlaceholder: (index: number) => ReactNode
  loading?: boolean
  onRangeChange?: (range: ListRange) => void
  listClassName?: string
  role?: string
}

export const ResourceGrid = <T,>({
  listKey,
  total,
  itemAt,
  renderItem,
  renderPlaceholder,
  loading,
  onRangeChange,
  listClassName,
  role,
}: ResourceGridProps<T>) => {
  const [location] = useLocation()
  const surface = useScrollSurface()

  // Read once: the grid restores through its initial state, so a later change would fight the scroll.
  const [restore] = useState(() => readListScroll(location, listKey))

  // Reordering keeps the surface but replaces the list, so nothing is left to restore to.
  useLayoutEffect(() => {
    if (!restore) surface?.scrollTo(0, 0)
  }, [restore, surface])

  const stateChanged = useCallback(
    (state: GridStateSnapshot) => writeListScroll(location, listKey, state),
    [location, listKey]
  )

  if (!surface) return null

  if (total === 0) {
    if (!loading) return null
    return (
      <div aria-busy className={listClassName}>
        {Array.from({ length: LOADING_CELLS }, (_, index) => (
          <div key={index}>{renderPlaceholder(index)}</div>
        ))}
      </div>
    )
  }

  return (
    <VirtuosoGrid
      role={role}
      customScrollParent={surface}
      totalCount={total}
      listClassName={listClassName}
      restoreStateFrom={restore}
      rangeChanged={onRangeChange}
      stateChanged={stateChanged}
      itemContent={index => {
        const item = itemAt(index)
        return item === undefined ? renderPlaceholder(index) : renderItem(item, index)
      }}
    />
  )
}
