import type { GridStateSnapshot } from "react-virtuoso"

// Keep the latest sorting state for the URL around. A change in listKey will purposefully overwrite it
const ENTRIES = new Map<string, { listKey: string; state: GridStateSnapshot }>()

export const hasListScroll = (location: string) => ENTRIES.has(location)

export const readListScroll = (location: string, listKey: string) => {
  const entry = ENTRIES.get(location)
  return entry?.listKey === listKey ? entry.state : undefined
}

export const writeListScroll = (location: string, listKey: string, state: GridStateSnapshot) => {
  ENTRIES.set(location, { listKey, state })
}
