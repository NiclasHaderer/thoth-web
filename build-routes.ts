import * as nodeFs from "node:fs"
import * as path from "node:path"
import { fileURLToPath } from "node:url"
import type { Plugin } from "vite"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = __dirname
const routesDir = `${rootDir}/src/app`

type Layout = { export: string; importPath: string; lazy: false }
type Page = { export: string; importPath: string; lazy: boolean }

type SegmentType = "path" | "uuid" | "string" | "literal"

type Segment = {
  ignored: false
  segmentType: SegmentType
  segmentRegex: string
  variableName: string
  optional: boolean
}

type IgnoredSegment = {
  ignored: true
}

type Path = {
  layout: Layout | null
  page: Page | null
  children: Paths
  parent: Path | null
} & (Segment | IgnoredSegment)

type Paths = {
  [folderPath: string]: Path
}

const listFolderContent = async (folderPath: string): Promise<{ files: string[]; directories: string[] }> => {
  const content = await nodeFs.promises.readdir(folderPath, { withFileTypes: true })
  const files = content.filter(item => item.isFile()).map(item => item.name)
  const directories = content.filter(item => item.isDirectory()).map(item => item.name)
  return { files, directories }
}

const resolveExport = async (file: string): Promise<string> => {
  const fileContent = await nodeFs.promises.readFile(file, "utf-8")
  const exportMatch = fileContent.match(/export const ((?:\w|\d)+)/)
  if (!exportMatch) {
    throw new Error("Could not resolve export for " + file)
  }
  return exportMatch[1]
}

const getAtPath = (folderPath: string, rootPaths: Path): Path => {
  folderPath = folderPath.replace(routesDir, "")
  const segments = folderPath.split("/").filter(segment => segment !== "")
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]
    rootPaths = rootPaths.children[segment]
  }
  return rootPaths
}

const insertPath = (folderPath: string, layout: Path["layout"], page: Path["page"], rootPaths: Path) => {
  folderPath = folderPath.replace(routesDir, "")
  const segments = folderPath.split("/").filter(segment => segment !== "")
  let localRoot = rootPaths
  for (const segment of segments) {
    if (!(segment in localRoot.children)) {
      localRoot.children[segment] = {
        layout: null,
        page: null,
        children: {},
        parent: localRoot,
        ...segmentToPath(segment),
      }
    }
    localRoot = localRoot.children[segment]
  }

  const insertAt = getAtPath(folderPath, rootPaths)
  if (layout) {
    if (!layout.export) throw new Error(`No export symbol found for ${layout.importPath}`)
    insertAt.layout = layout
  }
  if (page) {
    if (!page.export) throw new Error(`No export symbol found for ${page.importPath}`)
    insertAt.page = page
  }
}

const resolvePaths = async (root: string, paths: Path) => {
  const { files, directories } = await listFolderContent(root)
  for (const file of files) {
    const importPath = `${root.replace(rootDir, "")}/${file}`.replace("/src", "@thoth")

    const exportSymbol = await resolveExport(`${root}/${file}`)

    if (file === "layout.tsx") {
      insertPath(
        root,
        {
          export: exportSymbol,
          importPath,
          lazy: false,
        },
        null,
        paths
      )
    } else if (file === "page.tsx") {
      insertPath(
        root,
        null,
        {
          export: exportSymbol,
          lazy: false,
          importPath,
        },
        paths
      )
    } else if (file === "page.lazy.tsx") {
      insertPath(
        root,
        null,
        {
          export: exportSymbol,
          lazy: true,
          importPath,
        },
        paths
      )
    } else {
      throw new Error(`Unexpected file: ${file}`)
    }
  }

  for (const directory of directories) {
    await resolvePaths(`${root}/${directory}`, paths)
  }
}

const resolveParamTypes = (path: Path | null) => {
  const parts: string[] = []

  while (path) {
    if (!path.ignored && path.segmentType !== "literal") {
      let part: string
      if (path.segmentType === "uuid") {
        part = `${path.variableName}: UUID`
      } else if (path.segmentType === "string") {
        part = `${path.variableName}: string`
      } else if (path.segmentType === "path") {
        part = `${path.variableName}: string`
      } else {
        throw new Error(`Unknown segment type "${String(path.segmentType)}" for variable "${path.variableName}"`)
      }
      if (path.optional) {
        part += ` | undefined`
      }
      parts.push(part)
    }
    path = path.parent
  }
  if (parts.length === 0) return `Record<string, never>`
  return `{ ${parts.join(", ")} }`
}

const segmentToPath = (segment: string): Segment | IgnoredSegment => {
  let segmentName: string
  let segmentType: SegmentType

  let optional = false
  if (segment.startsWith("[") || segment.endsWith("]") || (segment.startsWith("{") && segment.endsWith("}"))) {
    optional = segment.startsWith("{") && segment.endsWith("}")
    const cleanSegment = segment.replace("[", "").replace("]", "").replace("{", "").replace("}", "")
    const segmentPlusType = cleanSegment.split(" ")
    if (segmentPlusType.length > 2) {
      throw new Error(
        `Invalid segment name "${cleanSegment}" in path "${segment}". Segment names cannot contain more than 1 space`
      )
    }

    if (segmentPlusType.length == 1) {
      segmentName = cleanSegment
      segmentType = "string"
    } else {
      segmentType = segmentPlusType[0] as SegmentType
      segmentName = segmentPlusType[1]
    }
  } else if (segment.startsWith("(") && segment.endsWith(")")) {
    return { ignored: true }
  } else {
    segmentName = segment
    segmentType = "literal"
  }
  if (!segmentName.match(/^[a-z]|[A-Z]$/)) {
    throw new Error(`Invalid segment name "${segmentName}" in path "${segment}". Segment names must be alphanumeric.`)
  }

  let segmentRegex: string
  if (segmentType == "uuid") {
    segmentRegex = `(?<${segmentName}>[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})`
  } else if (segmentType == "path") {
    segmentRegex = `(?<${segmentName}>.*)`
  } else if (segmentType == "string") {
    segmentRegex = `(?<${segmentName}>(?:\\w|-)+)`
  } else if (segmentType == "literal") {
    segmentRegex = segmentName
  } else {
    throw new Error(`Unknown segment type "${String(segmentType)}" in path "${segment}"`)
  }

  return {
    ignored: false,
    segmentRegex,
    segmentType: segmentType,
    variableName: segmentName,
    optional,
  }
}

const loaderName = (page: Page) => `load${page.export}`

const getComponent = (page: Page) => {
  if (page.lazy) {
    return `
    <Suspense fallback={<></>}>
      <${page.export} {...params}/>
    </Suspense>
    `
  } else {
    return `<${page.export} {...params}/>`
  }
}

const buildRoutes = (paths: Path) => {
  const writeImports = (path: Path, imports: string[] = []): string[] => {
    const createImport = (p: Path["layout"] | Path["page"]) => {
      if (p?.lazy) {
        imports.push(
          `const ${loaderName(p)} = () => import('${p.importPath}').then(i => ({'default': i.${p.export}}))`,
          `const ${p.export} = lazy(${loaderName(p)})`
        )
      } else if (p) {
        imports.push(`import { ${p.export} } from '${p.importPath}'`)
      }
    }
    createImport(path.layout)
    createImport(path.page)
    for (const child in path.children) {
      imports.push(...writeImports(path.children[child]))
    }
    return imports
  }
  const imports = writeImports(paths, [
    'import { lazy, Suspense } from "react"',
    'import { Route, Router, Switch } from "wouter"',
    'import { useHashLocation } from "wouter/use-hash-location";',
    'import { NotFound } from "@thoth/components/not-found.tsx"',
    'import { UUID } from "@thoth/client"',
  ])

  const cleanupPath = (path: string) => {
    return path.replaceAll("//", "/").replaceAll("/", "\\/")
  }

  const joinUrlPaths = (base: string, path: Path) => {
    if (path.ignored) {
      return base
    }
    if (path.optional) {
      return `${base}(?:/${path.segmentRegex})?`
    } else {
      return `${base}/${path.segmentRegex}`
    }
  }

  const resolveAllPossibleChildPaths = (baseUrl: string, p: Path, topLevel = true): string[] => {
    let possibleUrls: string[] = []

    if (topLevel && p.page) {
      possibleUrls.push(cleanupPath(`^(${baseUrl})$`))
    }

    for (const [, child] of Object.entries(p.children)) {
      const childPath = joinUrlPaths(baseUrl, child)
      if (child.layout || child.page) {
        possibleUrls.push(cleanupPath(`^(${childPath})$`))
      }
      possibleUrls.push(...resolveAllPossibleChildPaths(childPath, child, false))
    }

    if (topLevel) {
      if (possibleUrls.length === 0) {
        possibleUrls.push(cleanupPath(`^${baseUrl}$`))
      }
      possibleUrls = [...new Set(possibleUrls)]
    }

    return possibleUrls
  }

  const lazyRoutes: string[] = []

  const writeRoutes = (path: Path, baseUrl: string): string[] => {
    const content = []
    let parentsLayoutClose: string[] = []
    if (path.layout) {
      content.push(
        `<Route path={/${resolveAllPossibleChildPaths(baseUrl, path).join("|")}/}>`,
        `{(params: ${resolveParamTypes(path)})=> (`,
        `<${path.layout.export} {...params}>`
      )
      parentsLayoutClose = [`</${path.layout.export}>`, ")}", `</Route>`, ...parentsLayoutClose]
    }

    if (path.page) {
      if (path.page.lazy) {
        lazyRoutes.push(`{ pattern: /^${cleanupPath(baseUrl)}$/, load: ${loaderName(path.page)} }`)
      }
      const contentStr = getComponent(path.page)
      const out = `
          <Route path={/^${cleanupPath(baseUrl)}$/}>
            { (params: ${resolveParamTypes(path)}) => {
              return (
                ${contentStr}
              )
            }}
          </Route>
      `
      content.push(out)
    }

    for (const [, child] of Object.entries(path.children)) {
      const childPath = joinUrlPaths(baseUrl, child)
      content.push(...writeRoutes(child, childPath))
    }

    return [...content, ...parentsLayoutClose]
  }

  const routes = writeRoutes(paths, "/")
  routes.push(`
  <Route>
    <NotFound/>
  </Route>
  `)

  const router = `
  export const Routes = () => {
    return (
      <Router hook={useHashLocation}>
        <Switch>
          ${routes.join("\n")}
        </Switch>
      </Router>
    )
  }
  `

  const prefetch = `
  const lazyRoutes: { pattern: RegExp; load: () => Promise<unknown> }[] = [
    ${lazyRoutes.join(",\n")}
  ]

  const prefetched = new Set<() => Promise<unknown>>()

  export const prefetchRoute = (path: string) => {
    for (const route of lazyRoutes) {
      if (route.pattern.test(path)) {
        if (!prefetched.has(route.load)) {
          prefetched.add(route.load)
          void route.load()
        }
        return
      }
    }
  }
  `

  return imports.join("\n") + "\n" + prefetch + "\n" + router
}

const writeFile = async (content: string) => {
  const destinationFile = `${rootDir}/src/routes.tsx`

  await nodeFs.promises.writeFile(destinationFile, content)
}

const getContent = async (makePretty: boolean) => {
  const paths: Path = {
    layout: null,
    page: null,
    children: {},
    parent: null,
    ignored: true,
  }
  await resolvePaths(routesDir, paths)
  const content = buildRoutes(paths)
  if (makePretty) {
    const prettier = await import("prettier")
    const config = await prettier.resolveConfig("src/000.tsx")
    return await prettier.format(content, {
      ...config!,
      filepath: "src/000.tsx",
    })
  } else {
    return content
  }
}

const writeRoutesFile = async (makePretty: boolean) => {
  const destinationFile = `${rootDir}/src/routes.tsx`

  const currentContent = await nodeFs.promises.readFile(destinationFile, "utf-8").catch(() => "")
  const newContent = await getContent(makePretty)

  if (currentContent.trim() !== newContent.trim()) {
    await writeFile(newContent)
  }
}

if (process.argv && process.argv.includes("--write-routes")) {
  void writeRoutesFile(true)
}

export const buildRoutesPlugin = (): Plugin => {
  return {
    name: "rebuild-routes",
    enforce: "pre",
    buildStart: async () => {
      await writeRoutesFile(true)
    },
    watchChange: async id => {
      if (id.replace(__dirname, "").startsWith("/src/app/")) {
        await writeRoutesFile(true)
      }
    },
  }
}
