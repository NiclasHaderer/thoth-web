export const toIdRecord = <T extends { id: string }>(itemList: T[]) => {
  return itemList.reduce((previousValue, currentValue) => {
    previousValue[currentValue.id] = currentValue
    return previousValue
  }, {} as Record<string, T>)
}

export const getItemById = <T extends { id: string }>(itemList: T[], id: string | undefined) => {
  return itemList.find(i => i.id === id)
}

export const replaceRangeInList = <T extends string, R extends T | { id: T }>(
  [...originalList]: T[],
  startIndex: number,
  replaceList: R[]
): T[] => {
  const mappedReplaceList = replaceList.map(e => {
    if (typeof e === "string") return e
    return e.id
  }) as T[]
  originalList.splice(startIndex, 0, ...mappedReplaceList)
  return [...new Set(originalList)]
}

export const insertAtPosition = <T>([...list]: T[], item: T, position: number): T[] => {
  if (position > list.length) {
    list.push(item)
    return list
  }
  list = list.filter(i => i !== item)
  list.splice(position, 0, item)
  return list
}
