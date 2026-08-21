import { ApiCallData, ApiInterceptor } from "./generated/client"
import {
  AuthorDetailed,
  Book,
  BookDetailed,
  FileSystemItem,
  GenreDetailed,
  NarratorDetailed,
  PaginatedResponse,
  SeriesDetailed,
  UUID,
} from "./generated/models"

const DETAIL_ROUTE =
  /^\/api\/libraries\/[^/]+\/(books|authors|series|narrators|genres)\/(?!sorting$|autocomplete$)[^/]+$/

const LIST_ROUTE = /^\/api\/libraries\/[^/]+\/(books|authors|series|narrators|genres)(?:\?|$)/

const FS_ROUTE = /^\/api\/fs(?:\?|$)/

const multiplier = (): number => Number(new URLSearchParams(window.location.search).get("fixture")) || 1

const copyId = (id: UUID, copy: number): UUID => `${id.slice(0, -4)}${copy.toString().padStart(4, "0")}` as UUID

const suffix = (value: string, copy: number): string => `${value} ${copy + 1}`

const copyTitled = <T extends { id: UUID; title: string }>(item: T, pass: number): T => ({
  ...item,
  id: copyId(item.id, pass),
  title: suffix(item.title, pass),
})

const copyNamedId = <T extends { id: UUID; name: string }>(item: T, pass: number): T => ({
  ...item,
  id: copyId(item.id, pass),
  name: suffix(item.name, pass),
})

const copyNamed = <T extends { name: string }>(item: T, pass: number): T => ({ ...item, name: suffix(item.name, pass) })

const copyFile = (item: FileSystemItem, pass: number): FileSystemItem => ({
  ...item,
  name: suffix(item.name, pass),
  path: suffix(item.path, pass),
})

const expand = <T>(items: T[], count: number, copy: (item: T, pass: number) => T): T[] =>
  Array.from({ length: count }, (_, pass) => (pass === 0 ? items : items.map(item => copy(item, pass)))).flat()

const expandBooks = (books: Book[], count: number): Book[] => expand(books, count, copyTitled)

const inflateBook = (book: BookDetailed, count: number): BookDetailed => ({
  ...book,
  authors: expand(book.authors, count, copyNamedId),
  narrators: expand(book.narrators, count, suffix),
  genres: expand(book.genres, count, suffix),
  series: expand(book.series, count, copyTitled),
  tracks: expand(book.tracks, count, (track, pass) => ({
    ...track,
    id: copyId(track.id, pass),
    title: `${track.title} (${pass + 1})`,
  })).map((track, index) => ({
    ...track,
    trackNr: index + 1,
    duration: index < book.tracks.length ? track.duration : 900 + ((index * 173) % 2400),
  })),
})

const inflateAuthor = (author: AuthorDetailed, count: number): AuthorDetailed => ({
  ...author,
  books: expandBooks(author.books, count),
  series: expand(author.series, count, copyTitled),
})

const inflateSeries = (series: SeriesDetailed, count: number): SeriesDetailed => ({
  ...series,
  books: expandBooks(series.books, count),
  narrators: expand(series.narrators, count, suffix),
})

const inflateName = <T extends NarratorDetailed | GenreDetailed>(named: T, count: number): T => ({
  ...named,
  books: expandBooks(named.books, count),
})

const inflateDetail = (resource: string, body: unknown, count: number): unknown => {
  switch (resource) {
    case "books":
      return inflateBook(body as BookDetailed, count)
    case "authors":
      return inflateAuthor(body as AuthorDetailed, count)
    case "series":
      return inflateSeries(body as SeriesDetailed, count)
    default:
      return inflateName(body as NarratorDetailed, count)
  }
}

const inflatePage = <T>(
  page: PaginatedResponse<T>,
  copy: (item: T, pass: number) => T,
  count: number,
  offset: number,
  limit: number
): PaginatedResponse<T> => {
  const first = Math.floor(offset / count)
  const total = page.total * count
  const items: T[] = []
  for (let index = offset; index < Math.min(offset + limit, total); index++) {
    const original = page.items[Math.floor(index / count) - first]
    if (original === undefined) break
    items.push(index % count === 0 ? original : copy(original, index % count))
  }
  return { items, limit, offset, total }
}

const inflateList = (
  resource: string,
  body: unknown,
  count: number,
  offset: number,
  limit: number
): PaginatedResponse<unknown> => {
  switch (resource) {
    case "authors":
      return inflatePage(body as PaginatedResponse<{ id: UUID; name: string }>, copyNamedId, count, offset, limit)
    case "narrators":
    case "genres":
      return inflatePage(body as PaginatedResponse<{ name: string }>, copyNamed, count, offset, limit)
    default:
      return inflatePage(body as PaginatedResponse<{ id: UUID; title: string }>, copyTitled, count, offset, limit)
  }
}

const jsonBody =
  (data: ApiCallData, transform: (body: unknown) => unknown): ApiCallData["executor"] =>
  async callData => {
    const response = await data.executor(callData)
    if (!(response instanceof Response) || !response.ok) return response
    return { success: true, body: transform(await response.json()) } as const
  }

const pageRange = (route: string): { offset: number; limit: number } | undefined => {
  const params = new URLSearchParams(route.split("?")[1])
  const limit = Number(params.get("limit"))
  const offset = Number(params.get("offset")) || 0
  return limit > 0 ? { offset, limit } : undefined
}

const withRange = (route: string, offset: number, limit: number): string => {
  const [path, query] = route.split("?")
  const params = new URLSearchParams(query)
  params.set("offset", offset.toString())
  params.set("limit", limit.toString())
  return `${path}?${params.toString()}`
}

export const httpInterceptor: ApiInterceptor = data => {
  const count = multiplier()
  if (count < 2 || data.method !== "GET") return data

  const detail = DETAIL_ROUTE.exec(data.route)?.[1]
  if (detail) return { ...data, executor: jsonBody(data, body => inflateDetail(detail, body, count)) }

  if (FS_ROUTE.test(data.route)) {
    return { ...data, executor: jsonBody(data, body => expand(body as FileSystemItem[], count, copyFile)) }
  }

  const resource = LIST_ROUTE.exec(data.route)?.[1]
  const range = resource ? pageRange(data.route) : undefined
  if (!resource || !range) return data

  const first = Math.floor(range.offset / count)
  const route = withRange(data.route, first, Math.ceil((range.offset + range.limit) / count) - first)

  return {
    ...data,
    route,
    executor: jsonBody(data, body => inflateList(resource, body, count, range.offset, range.limit)),
  }
}
