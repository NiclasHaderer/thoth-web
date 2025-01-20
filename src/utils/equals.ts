/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access */
export const shallowEquals = (a: unknown, b: unknown) => a === b
export const containsPrimitives = (...objects: unknown[]) => objects.some(o => !(o instanceof Object))

const comparator = (a: unknown, b: unknown): boolean | null => {
  // First check if the objects are shallow equal. If this is true, we can skip the whole other part
  if (shallowEquals(a, b)) return true

  // Check if one of them is a primitive and if yes, we can assume that they are not equal, because the previous check
  // was false
  if (containsPrimitives(a, b)) return false
  return null
}

export const deepEquals = (a: any, b: any, { allowAdditionalKeysInB = false } = {}): boolean => {
  const topEqual = comparator(a, b)
  if (typeof topEqual === "boolean") return topEqual

  // Create iterators which will iterate over the objects and the children of the objects
  const objectAIterator = [a]
  const objectBIterator = [b]

  while (objectAIterator.length > 0 && objectBIterator.length > 0) {
    // Get the objects themselves
    const objectA = objectAIterator.pop()
    const objectB = objectBIterator.pop()

    // Get the keys of the objects
    const keysA = Object.keys(objectA)
    const keysB = Object.keys(objectB)

    // Objects don't have the same number of keys

    // A has more keys than B, therefore, B cannot be a subset of A
    if (keysA.length > keysB.length) return false

    // B has more keys than A, therefore, B can be a subset of A if the additional keys are allowed
    if (!allowAdditionalKeysInB && keysA.length < keysB.length) return false

    // tslint:disable-next-line:prefer-for-of
    for (let index = 0; index < keysA.length; ++index) {
      const keyA = keysA[index]
      // One of the keys is not the same
      if (!(keyA in objectB)) return false

      // Save the values of the keys
      const objectAValue = objectA[keyA]
      const objectBValue = objectB[keyA]

      // Compare the values
      const areEqual = comparator(objectAValue, objectBValue)

      // One of the values is not the same
      if (areEqual === false) return false
      // Values cannot be compared, because the keys are objects themselves.
      // Therefore, add them to the iterators and compare them again
      if (areEqual === null) {
        objectAIterator.push(objectAValue)
        objectBIterator.push(objectBValue)
      }
    }
  }
  return true
}
