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
  return date ? new Date(date).toISOString().slice(0, 10) : null
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
