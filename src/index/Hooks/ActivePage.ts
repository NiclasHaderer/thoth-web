import { useRoute } from "wouter"
import { useEffect, useState } from "react"

type active = "books" | "authors" | "series"

export const useImportantState = () => {
  const [active, setActive] = useState<active | null>(null)

  const [isBook] = useRoute("/books")
  const [isBookId] = useRoute("/books/:id")
  const [isAuthor] = useRoute("/authors/")
  const [isAuthorId] = useRoute("/authors/:id")
  const [isSeries] = useRoute("/series")
  const [isSeriesId] = useRoute("/series/:id")
  useEffect(() => {
    if (isBook || isBookId) {
      setActive("books")
    } else if (isSeries || isSeriesId) {
      setActive("series")
    } else if (isAuthor || isAuthorId) {
      setActive("authors")
    } else {
      setActive(null)
    }
  }, [isBook, isBookId, isAuthor, isAuthorId, isSeries, isSeriesId])

  return active
}
