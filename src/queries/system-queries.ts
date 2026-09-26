import { useQuery } from "@tanstack/react-query"
import { queries } from "./query-definitions"

export const useFolders = (path: string) => useQuery(queries.folders(path))
export const useMetadataAgents = () => useQuery(queries.metadataAgents)
export const useFileScanners = () => useQuery(queries.fileScanners)
export const useServerLicenses = () => useQuery(queries.serverLicenses)
export const useWebLicenses = () => useQuery(queries.webLicenses)
