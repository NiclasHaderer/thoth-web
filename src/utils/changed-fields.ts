import { deepEquals } from "./deep-equals"

const blankToNull = (value: unknown) => (value === "" ? null : value)

export const changedFields = <T extends object>(initial: T, current: T): Partial<T> => {
  const changed: Partial<T> = {}
  for (const key of Object.keys(current) as (keyof T)[]) {
    const value = blankToNull(current[key])
    if (value !== undefined && !deepEquals(blankToNull(initial[key]) ?? null, value)) changed[key] = value as T[keyof T]
  }
  return changed
}
