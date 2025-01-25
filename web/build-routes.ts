import fs from "node:fs"
import path from "node:path"
import { KEEP_INDENT, trimIndent } from "./src/utils/trim-inden"

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
  layout: string | null
  page: string | null
  children: Paths
}

const paths: Path = {
  layout: null,
  page: null,
  children: {},
}

const resolveExport = async (file: string): Promise<string> => {
  const fileContent = await fs.promises.readFile(file, "utf-8")
  const exportMatch = fileContent.match(/export const (.+) = /)
  if (!exportMatch) {
    throw new Error(`No export found in ${file}`)
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

const insertPath = (folderPath: string, layout: string | null, page: string | null) => {
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
    insertAt.layout = layout
  }
  if (page) {
    insertAt.page = page
  }
}

const resolvePaths = async (root: string) => {
  const { files, directories } = await listFolderContent(root)
  for (const file of files) {
    if (file === "layout.tsx") {
      insertPath(root, await resolveExport(path.join(root, file)), null)
    } else if (file === "page.tsx") {
      insertPath(root, null, await resolveExport(path.join(root, file)))
    } else {
      throw new Error(`Unexpected file: ${file}`)
    }
  }

  for (const directory of directories) {
    await resolvePaths(path.join(root, directory))
  }
}

const writeRoutes = async () => {
  const writeImports = (path: Path, folderPath: string, imports: string[] = []): string[] => {
    if (path.layout) {
      imports.push(`import { ${path.layout} } from '${folderPath}/layout.tsx'`)
    }
    if (path.page) {
      imports.push(`import { ${path.page} } from '${folderPath}/page.tsx'`)
    }
    for (const child in path.children) {
      imports.push(...writeImports(path.children[child], `${folderPath}/${child}`))
    }
    return imports
  }
  const imports = writeImports(paths, "@thoth/app", [
    'import { Route, Router, Switch } from "wouter"',
    'import { UUID } from "@thoth/client"',
  ])

  const writeRoutes = (
    path: Path,
    folderPath: string,
    parentLayoutsOpen: string[],
    parentsLayoutClose: string[]
  ): string => {
    let content = ""
    if (path.layout) {
      parentLayoutsOpen = [...parentLayoutsOpen, `<${path.layout}>`]
      parentsLayoutClose = [`</${path.layout}>`, ...parentsLayoutClose]
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

    if (path.page) {
      const parentLayoutStr = joinIndenting(parentLayoutsOpen, false)
      const parentsLayoutCloseStr = joinIndenting(parentsLayoutClose, true)
      const contentStr = `${KEEP_INDENT}  `.repeat(parentLayoutsOpen.length) + `<${path.page} {...params}/>`

      content += trimIndent`
        <Route path="${folderPath || "/"}">
          { (params: ${resolveParamsAndTypes(folderPath)}) => {
            return (
              ${parentLayoutStr}
              ${contentStr}
              ${parentsLayoutCloseStr}
            )
          }}

        </Route>\n
      `
    }

    const toParamPath = (path: string) => {
      if (path.startsWith("[") && path.endsWith("]")) {
        return path.replace("[", ":").replace("]", "")
      }
      return path
    }

    for (const child in path.children) {
      const childPath =
        child.startsWith("(") && child.endsWith(")") ? folderPath : `${folderPath}/${toParamPath(child)}`
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
