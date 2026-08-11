import { execSync } from "node:child_process"
import * as fs from "node:fs"
import * as path from "node:path"
import { fileURLToPath } from "node:url"

const rootDir = path.dirname(fileURLToPath(import.meta.url))
const outFile = path.join(rootDir, "src/assets/third-party-licenses.json")

type PackageJson = {
  name: string
  version: string
  license?: string | { type?: string }
  licenses?: Array<{ type?: string } | string>
  repository?: string | { url?: string }
  homepage?: string
}

const normalizeLicense = (pkg: PackageJson): string => {
  if (typeof pkg.license === "string") return pkg.license
  if (pkg.license && typeof pkg.license === "object") return pkg.license.type ?? "UNKNOWN"
  if (Array.isArray(pkg.licenses))
    return pkg.licenses.map(l => (typeof l === "string" ? l : (l.type ?? "UNKNOWN"))).join(", ")
  return "UNKNOWN"
}

const readLicenseText = (dir: string): string | undefined => {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const match = entries.find(e => e.isFile() && /^(licen[cs]e|copying|notice)/i.test(e.name))
  if (!match) return undefined
  return fs.readFileSync(path.join(dir, match.name), "utf-8").trim()
}

const repoUrl = (pkg: PackageJson): string | undefined => {
  const r = pkg.repository
  const url = typeof r === "string" ? r : r?.url
  return (url ?? pkg.homepage ?? "").replace(/^git\+/, "").replace(/\.git$/, "") || undefined
}

const paths = execSync("npm ls --omit=dev --all --parseable", { cwd: rootDir, encoding: "utf-8" })
  .split("\n")
  .map(l => l.trim())
  .filter(l => l.includes("node_modules"))

const seen = new Set<string>()
const packages = []
for (const dir of paths) {
  const pkgJson = path.join(dir, "package.json")
  if (!fs.existsSync(pkgJson)) continue
  const pkg = JSON.parse(fs.readFileSync(pkgJson, "utf-8")) as PackageJson
  const key = `${pkg.name}@${pkg.version}`
  if (seen.has(key)) continue
  seen.add(key)
  packages.push({
    name: pkg.name,
    version: pkg.version,
    license: normalizeLicense(pkg),
    repository: repoUrl(pkg),
    text: readLicenseText(dir),
  })
}

packages.sort((a, b) => a.name.localeCompare(b.name))

fs.mkdirSync(path.dirname(outFile), { recursive: true })
fs.writeFileSync(outFile, JSON.stringify(packages, null, 2) + "\n")
console.log(`Wrote ${packages.length} licenses to ${path.relative(rootDir, outFile)}`)
