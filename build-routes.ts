import fs from "node:fs"
import path from "node:path"

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
  const imports = ['import { Router, Switch } from "wouter"']

  const writeImports = (path: Path, folderPath: string) => {
    if (path.layout) {
      imports.push(`import { ${path.layout} } from '${folderPath}/layout'`)
    }
    if (path.page) {
      imports.push(`import { ${path.page} } from '${folderPath}/page'`)
    }
    for (const child in path.children) {
      writeImports(path.children[child], `${folderPath}/${child}`)
    }
  }
  writeImports(paths, "./app")

  const router = `
  export const Routes = () => {
    return <Router>
      <Switch>
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
