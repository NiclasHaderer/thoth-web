export const toIdRecord = <T extends { id: string }>(itemList: T[]) => {
  return itemList.reduce((previousValue, currentValue) => {
    previousValue[currentValue.id] = currentValue;
    return previousValue;
  }, {} as Record<string, T>);
};
