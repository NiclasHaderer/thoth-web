export const toBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    reader.onload = () => resolve(reader.result!.toString())
    reader.onerror = reject
  })

export const isUUID = (uuidString: string): boolean => {
  return /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i.test(uuidString)
}

export const formatDate = (date: Date | number | string) => {
  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
}

export const apiErrorMessage = (error: string | object): string => {
  if (typeof error === "string") return error
  if (error && typeof error === "object" && "error" in error && typeof error.error === "string") return error.error
  return "Something went wrong"
}

export const notNullIsh = <T>(p: T | null | undefined): p is T => p !== null && p !== undefined

export const toFormDate = (date: Date | number | string): string | null => {
  if (!date) return null
  const parsed = new Date(date)
  const month = `${parsed.getMonth() + 1}`.padStart(2, "0")
  const day = `${parsed.getDate()}`.padStart(2, "0")
  return `${parsed.getFullYear()}-${month}-${day}`
}

export const fromFormDate = (date?: string | null): number | null => {
  if (!date) return null
  const [year, month, day] = date.split("-").map(Number)
  return new Date(year, month - 1, day).getTime()
}

export const toRealURL = (baseUrl: string): string => {
  if (baseUrl.startsWith("/")) {
    return `${window.location.protocol}//${window.location.host}${baseUrl}`
  }
  return baseUrl
}

export const unique = <T>(list?: T[]): T[] => {
  return [...new Set(list)]
}

export const pluralize = (count: number, singular: string, plural = `${singular}s`): string => {
  return `${count} ${count === 1 ? singular : plural}`
}
