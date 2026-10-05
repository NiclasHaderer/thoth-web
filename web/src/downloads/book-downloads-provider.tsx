import { FC, ReactNode, useEffect } from "react"
import { bookDownloads } from "./book-downloads-actions"

export const BookDownloadsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  useEffect(() => void bookDownloads.restore(), [])
  return children
}
