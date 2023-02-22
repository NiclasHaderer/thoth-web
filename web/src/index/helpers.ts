export const toIdRecord = <T extends { id: string }>(itemList: T[]) => {
  return itemList.reduce((previousValue, currentValue) => {
    previousValue[currentValue.id] = currentValue
    return previousValue
  }, {} as Record<string, T>)
}

export const replaceRangeInList = <T extends string, R extends T | { id: T }>(
  [...originalList]: T[] | Readonly<T[]>,
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

export const insertAtPosition = <T>(list: T[], item: T, position: number): T[] => {
  list = list.filter(i => i !== item)
  if (position >= list.length) {
    list.push(item)
  } else {
    list.splice(position, 0, item)
  }
  return list
}

export const toBase64 = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
  })

export const isUUID = (uuidString: string): boolean => {
  return /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i.test(uuidString)
}
