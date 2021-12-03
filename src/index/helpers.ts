export const toIdRecord = <T extends { id: string }>(itemList: T[]) => {
  return itemList.reduce((previousValue, currentValue) => {
    previousValue[currentValue.id] = currentValue;
    return previousValue;
  }, {} as Record<string, T>);
};


export const getItemById = <T extends { id: string }>(itemList: T[], id: string | undefined) => {
  return itemList.find(i => i.id === id);
};


export const replaceRangeInList = <T>([...originalList]: T[], startIndex: number, replaceList: T[]): T[] => {
  originalList.splice(startIndex, 0, ...replaceList);
  return originalList;
};
