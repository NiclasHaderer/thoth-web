import fs from "node:fs"
import path from "node:path"
import { keepIndent, trimIndent } from "./src/utils/trim-inden"

const listFolderContent = async (folderPath: string): Promise<{ files: string[]; directories: string[] }> => {
  const content = await fs.promises.readdir(folderPath, { withFileTypes: true })
  const files = content.filter(item => item.isFile()).map(item => item.name)
  const directories = content.filter(item => item.isDirectory()).map(item => item.name)
  return { files, directories }
}

const rootDir = __dirname
const routesDir = path.join(rootDir, "src", "app")

type Paths = {
  [folderPath: string]: Path
}

type Path = {
  layout: { export: string; importPath: string; lazy: false } | null
  page: { export: string; importPath: string; lazy: boolean } | null
  children: Paths
}

const paths: Path = {
  layout: null,
  page: null,
  children: {},
}

const resolveExport = async (file: string): Promise<string | null> => {
  const fileContent = await fs.promises.readFile(file, "utf-8")
  const exportMatch = fileContent.match(/export const (.+) = /)
  if (!exportMatch) return null
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
    const importPath = path.join(root.replace(rootDir, ""), file).replace("/src", ".")
    const exportSymbol = await resolveExport(path.join(root, file))

    if (file === "layout.tsx") {
      insertPath(
        root,
        {
          export: exportSymbol,
          importPath,
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
    await resolvePaths(path.join(root, directory))
  }
}

const joinIndenting = (arr: string[], reversed): string => {
  let final = ""
  for (let idx = 0; idx < arr.length; idx++) {
    const item = arr[idx]
    const indexCalc = reversed ? arr.length - idx - 1 : idx
    const indent = "  ".repeat(indexCalc)
    final += `${indent}${item}`
    if (idx < arr.length - 1) {
      final += "\n"
    }
  }
  return final
}

const padStart = (str: string, paddingCount: number): string => {
  paddingCount = Math.max(0, paddingCount)
  return str
    .split("\n")
    .map(s => " ".repeat(paddingCount) + s)
    .join("\n")
}

const resolveParamsAndTypes = (path: string) => {
  let final = `{`
  for (const segment of path.split("/")) {
    if (segment.startsWith(":")) {
      if (segment.toLowerCase().includes("id")) {
        final += `${segment.replace(":", "")}: UUID,`
      } else {
        final += `${segment.replace(":", "")}: string,`
      }
    }
  }
  final += `}`
  return final
}

const segmentShouldBeIgnored = (segment: string) => {
  return segment.startsWith("(") && segment.endsWith(")")
}

const segmentToPath = (segment: string) => {
  if (segment.startsWith("[") && segment.endsWith("]")) {
    return segment.replace("[", ":").replace("]", "")
  }
  return segment
}

const getPageComponent = (page: Path["page"]) => {
  if (page.lazy) {
    return trimIndent`
    <Suspense fallback={"Loading..."}>
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
  const imports = writeImports(paths, "@thoth/app", [
    'import { Suspense, lazy } from "react"',
    'import { Route, Router, Switch } from "wouter"',
    'import { UUID } from "@thoth/client"',
  ])

  const writeRoutes = (
    path: Path,
    urlPath: string,
    parentLayoutsOpen: string[],
    parentsLayoutClose: string[]
  ): string => {
    let content = ""
    if (path.layout) {
      parentLayoutsOpen = [...parentLayoutsOpen, `<${path.layout.export}>`]
      parentsLayoutClose = [`</${path.layout.export}>`, ...parentsLayoutClose]
    }

    if (path.page) {
      const parentLayoutStr = joinIndenting(parentLayoutsOpen, false)
      const parentsLayoutCloseStr = joinIndenting(parentsLayoutClose, true)
      const contentStr = padStart(getPageComponent(path.page), (parentLayoutsOpen.length - 1) * 2)

      content += trimIndent`
        <Route path="${urlPath || "/"}">
          { (params: ${resolveParamsAndTypes(urlPath)}) => {
            return (
              ${parentLayoutStr}
              ${keepIndent(contentStr)}
              ${parentsLayoutCloseStr}
            )
          }}

        </Route>\n
      `
    }

    for (const child in path.children) {
      const childPath = segmentShouldBeIgnored(child) ? urlPath : `${urlPath}/${segmentToPath(child)}`
      content += writeRoutes(path.children[child], childPath, parentLayoutsOpen, parentsLayoutClose)
    }

    return content
  }

  const routes = writeRoutes(paths, "", [], [])

  const router = trimIndent`
  export const Routes = () => {
    return <Router>
      <Switch>
        ${routes}
      </Switch>
    </Router>
  }
  `

  let content = imports.join("\n") + "\n" + router

  await fs.promises.writeFile(path.join(rootDir, "src", "routes.tsx"), content)
}

const main = async () => {
  await resolvePaths(routesDir)

  await writeRoutes()
}

void main()
