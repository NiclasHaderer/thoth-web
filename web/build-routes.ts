import * as nodeFs from "node:fs"
import * as nodePath from "node:path"
import * as path from "node:path"
import { keepIndent, trimIndent } from "./src/utils/trim-inden"
import { fileURLToPath } from "node:url"

const listFolderContent = async (folderPath: string): Promise<{ files: string[]; directories: string[] }> => {
  const content = await nodeFs.promises.readdir(folderPath, { withFileTypes: true })
  const files = content.filter(item => item.isFile()).map(item => item.name)
  const directories = content.filter(item => item.isDirectory()).map(item => item.name)
  return { files, directories }
}
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = __dirname
const routesDir = nodePath.join(rootDir, "src", "app")

type Layout = { export: string; importPath: string; lazy: false }
type Page = { export: string; importPath: string; lazy: boolean }

type Path = {
  layout: Layout | null
  page: Page | null
  children: Paths
}

type Paths = {
  [folderPath: string]: Path
}

const paths: Path = {
  layout: null,
  page: null,
  children: {},
}

const resolveExport = async (file: string): Promise<string> => {
  const fileContent = await nodeFs.promises.readFile(file, "utf-8")
  const exportMatch = fileContent.match(/export const ((?:\w|\d)+)/)
  if (!exportMatch) {
    throw new Error("Could not resolve export for " + file)
  }
  return exportMatch[1]
}

const getAtPath = (folderPath: string): Path => {
  folderPath = folderPath.replace(routesDir, "")
  const segments = folderPath.split("/").filter(segment => segment !== "")
  let rootPaths = paths
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]
    rootPaths = rootPaths.children[segment]
  }
  return rootPaths
}

const insertPath = (folderPath: string, layout: Path["layout"], page: Path["page"]) => {
  folderPath = folderPath.replace(routesDir, "")
  const segments = folderPath.split("/").filter(segment => segment !== "")
  let rootPaths = paths
  for (const segment of segments) {
    if (!(segment in rootPaths.children)) {
      rootPaths.children[segment] = {
        layout: null,
        page: null,
        children: {},
      }
    }
    rootPaths = rootPaths.children[segment]
  }

  const insertAt = getAtPath(folderPath)
  if (layout) {
    if (!layout.export) throw new Error(`No export symbol found for ${layout.importPath}`)
    insertAt.layout = layout
  }
  if (page) {
    if (!page.export) throw new Error(`No export symbol found for ${page.importPath}`)
    insertAt.page = page
  }
}

const resolvePaths = async (root: string) => {
  const { files, directories } = await listFolderContent(root)
  for (const file of files) {
    const importPath = nodePath.join(root.replace(rootDir, ""), file).replace("/src", ".")
    const exportSymbol = await resolveExport(nodePath.join(root, file))

    if (file === "layout.tsx") {
      insertPath(
        root,
        {
          export: exportSymbol,
          importPath,
          lazy: false,
        },
        null
      )
    } else if (file === "page.tsx") {
      insertPath(root, null, {
        export: exportSymbol,
        lazy: false,
        importPath,
      })
    } else if (file === "page.lazy.tsx") {
      insertPath(root, null, {
        export: exportSymbol,
        lazy: true,
        importPath,
      })
    } else {
      throw new Error(`Unexpected file: ${file}`)
    }
  }

  for (const directory of directories) {
    await resolvePaths(nodePath.join(root, directory))
  }
}

const resolveParamsAndTypes = (path: string) => {
  let final = `{`

  const finds = path.matchAll(/\?<(\w+)>/g)
  for (const find of finds) {
    final += `${find[1]}: string,`
  }
  final += `}`
  return final
}

const segmentShouldBeIgnored = (segment: string) => {
  return segment.startsWith("(") && segment.endsWith(")")
}

const segmentToPath = (segment: string) => {
  if (segment.startsWith("[") && segment.endsWith("]")) {
    const segmentName = segment.replace("[", "").replace("]", "")
    return `(?<${segmentName}>(\\w+|\\d|-|_))`
  }
  return segment
}

const getComponent = (page: Page) => {
  if (page.lazy) {
    return trimIndent`
    <Suspense fallback={<Loading count={16}/> }>
      <${page.export} {...params}/>
    </Suspense>
    `
  } else {
    return `<${page.export} {...params}/>`
  }
}

const writeRoutes = async () => {
  const writeImports = (path: Path, folderPath: string, imports: string[] = []): string[] => {
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
      imports.push(...writeImports(path.children[child], `${folderPath}/${child}`))
    }
    return imports
  }
  const imports = writeImports(paths, "@ratings/app", [
    'import { Route, Router, Redirect, Switch } from "wouter"',
    'import { useHashLocation } from "wouter/use-hash-location";',
  ])

  const resolveAllPossibleChildPaths = (baseUrl: string, p: Path, topLevel = true): string[] => {
    let possibleUrls: string[] = []

    for (const [childDir, child] of Object.entries(p.children)) {
      const childPath = segmentShouldBeIgnored(childDir) ? baseUrl : nodePath.join(baseUrl, segmentToPath(childDir))
      if (child.layout || child.page) {
        possibleUrls.push(`(${childPath})`)
      }
      possibleUrls.push(...resolveAllPossibleChildPaths(childPath, child, false))
    }

    if (topLevel) {
      if (possibleUrls.length === 0) {
        possibleUrls.push(baseUrl)
      }
      possibleUrls = possibleUrls
        .map(u => u.replaceAll("/", "\\/"))
        .map(u => u.replaceAll(/\?<\w+>/g, ""))
        .map(u => u.replaceAll("((", "("))
        .map(u => u.replaceAll("))", ")"))
      possibleUrls = [...new Set(possibleUrls)]
    }

    return possibleUrls
  }

  const writeRoutes = (path: Path, baseUrl: string): string[] => {
    const content = []
    let parentsLayoutClose: string[] = []
    if (path.layout) {
      content.push(
        `<Route path={/^${resolveAllPossibleChildPaths(baseUrl, path).join("|")}\\/?$/}>`,
        `<${path.layout.export}>`
      )
      parentsLayoutClose = [`</${path.layout.export}>`, `</Route>`, ...parentsLayoutClose]
    }

    if (path.page) {
      const contentStr = getComponent(path.page)
      const out = trimIndent`
          <Route path="${baseUrl}">
            { (params: ${resolveParamsAndTypes(baseUrl)}) => {
              return (
                ${keepIndent(contentStr)}
              )
            }}
          </Route>
      `
      content.push(out)
    }

    for (const [childDir, child] of Object.entries(path.children)) {
      const childPath = segmentShouldBeIgnored(childDir) ? baseUrl : nodePath.join(baseUrl, segmentToPath(childDir))
      content.push(...writeRoutes(child, childPath))
    }

    return [...content, ...parentsLayoutClose]
  }

  const routes = writeRoutes(paths, "/")
  routes.push(trimIndent`
  <Route>
    <Redirect to="/" />
  </Route>
  `)

  const router = trimIndent`
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

  const content = imports.join("\n") + "\n" + router
  await nodeFs.promises.writeFile(nodePath.join(rootDir, "src", "routes.tsx"), content)
}

const main = async () => {
  await resolvePaths(routesDir)

  await writeRoutes()
}

void main()
