import * as nodeFs from "node:fs"
import * as nodePath from "node:path"
import * as path from "node:path"
import { fileURLToPath } from "node:url"
import type { Plugin } from "vite"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = __dirname
const routesDir = nodePath.join(rootDir, "src", "app")

type Layout = { export: string; importPath: string; lazy: false }
type Page = { export: string; importPath: string; lazy: boolean }

type SegmentType = "path" | "uuid" | "string" | "literal"

type Path = {
  layout: Layout | null
  page: Page | null
  children: Paths
  segmentRegex: string | null
  type: SegmentType | null
  variableName: string | null
  parent: Path | null
}

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
        ...segmentToPath(segment),
        parent: localRoot,
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
    const importPath = nodePath.join(root.replace(rootDir, ""), file).replace("/src", "@thoth")

    const exportSymbol = await resolveExport(nodePath.join(root, file))

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
    await resolvePaths(nodePath.join(root, directory), paths)
  }
}

const resolveParamTypes = (path: Path | null) => {
  let final = `{`

  while (path) {
    if (path.variableName) {
      console.assert(path.type !== "literal")
      if (path.type === "uuid") {
        final += `${path.variableName}: UUID,`
      } else if (path.type === "string") {
        final += `${path.variableName}: string,`
      } else if (path.type === "path") {
        final += `${path.variableName}: string,`
      } else {
        throw new Error(`Unknown segment type "${path.type}" for variable "${path.variableName}"`)
      }
    }
    path = path.parent
  }
  final += `}`
  return final
}

const segmentToPath = (segment: string): Pick<Path, "segmentRegex" | "type" | "variableName"> => {
  let segmentName: string
  let segmentType: SegmentType

  if (segment.startsWith("[") && segment.endsWith("]")) {
    let cleanSegment = segment.replace("[", "").replace("]", "")
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
    return { segmentRegex: null, type: null, variableName: null }
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
    segmentRegex = `(?<${segmentName}>[^/]+)`
  } else if (segmentType == "string") {
    segmentRegex = `(?<${segmentName}>(?:\\w|-)+)`
  } else if (segmentType == "literal") {
    segmentRegex = segmentName
  } else {
    throw new Error(`Unknown segment type "${segmentType}" in path "${segment}"`)
  }

  return {
    segmentRegex,
    type: segmentType,
    variableName: segmentType === "literal" ? null : segmentName,
  }
}

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

const buildRoutes = async (paths: Path) => {
  const writeImports = (path: Path, imports: string[] = []): string[] => {
    const createImport = (p: Path["layout"] | Path["page"]) => {
      if (p?.lazy) {
        imports.push(
          `const ${p.export} = lazy(() => import('${p.importPath}').then(i => ({'default': i.${p.export}})))`
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
    return path.replaceAll("/", "\\/")
  }

  const resolveAllPossibleChildPaths = (baseUrl: string, p: Path, topLevel = true): string[] => {
    let possibleUrls: string[] = []

    for (const [, child] of Object.entries(p.children)) {
      const childPath = child.segmentRegex ? nodePath.join(baseUrl, child.segmentRegex) : baseUrl
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
      const contentStr = getComponent(path.page)
      const baseUrlRegex = baseUrl.replaceAll("/", "\\/")
      const out = `
          <Route path={/^${baseUrlRegex}$/}>
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
      const childPath = child.segmentRegex ? nodePath.join(baseUrl, child.segmentRegex) : baseUrl
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

  return imports.join("\n") + "\n" + router
}

const writeFile = async (content: string) => {
  const destinationFile = nodePath.join(rootDir, "src", "routes.tsx")

  await nodeFs.promises.writeFile(destinationFile, content)
}

const getContent = async () => {
  const paths: Path = {
    layout: null,
    page: null,
    children: {},
    segmentRegex: "",
    type: "path",
    parent: null,
    variableName: null,
  }
  await resolvePaths(routesDir, paths)
  const content = await buildRoutes(paths)
  if (process.env.ENABLE_PRETTIER) {
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

const writeRoutesFile = async () => {
  const destinationFile = nodePath.join(rootDir, "src", "routes.tsx")

  const currentContent = await nodeFs.promises.readFile(destinationFile, "utf-8").catch(() => "")
  const newContent = await getContent()

  if (currentContent.trim() !== newContent.trim()) {
    await writeFile(newContent)
  }
}

if (process.argv && process.argv.includes("--write-routes")) {
  void writeRoutesFile()
}

export const buildRoutesPlugin = (): Plugin => {
  return {
    name: "rebuild-routes",
    enforce: "pre",
    buildStart: async () => {
      await writeRoutesFile()
    },
    watchChange: async id => {
      if (id.replace(__dirname, "").startsWith("/src/app/")) {
        await writeRoutesFile()
      }
    },
  }
}
