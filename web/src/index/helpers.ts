export const toIdRecord = <T extends { id: string }>(itemList: T[]) => {
  return itemList.reduce((previousValue, currentValue) => {
    previousValue[currentValue.id] = currentValue;
    return previousValue;
  }, {} as Record<string, T>);
};

export const replaceInList = <T extends { id: string }>(oldList: T[], newItem: T) => {
  const index = oldList.findIndex(i => i.id === newItem.id);
  if (index === -1) return [...oldList, newItem];

  const copy = [...oldList];
  copy[index] = newItem;
  return copy;
};

export const getItemById = <T extends { id: string }>(itemList: T[], id: string | undefined) => {
  return itemList.find(i => i.id === id);
};

export const unique = <T>(itemList: T[], getKey: (k: T) => string): T[] => {
  const map: Record<string, T> = {};
  for (let item of itemList) {
    map[getKey(item)] = item;
  }
  return Object.values(map);
};
