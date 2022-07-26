import { useImportantState } from "./ActivePage"
import { useEffect } from "react"
import { useAudiobookState } from "../State/Audiobook.State"

export const useClearUnimportantState = () => {
  const importantState = useImportantState()
  const audiobookState = useAudiobookState()

  useEffect(() => {
    const clearer: (() => void)[] = []
    if (importantState !== "books") {
      clearer.push(audiobookState.clearBooks)
    }
    if (importantState !== "series") {
      clearer.push(audiobookState.clearSeries)
    }
    if (importantState !== "authors") {
      clearer.push(audiobookState.clearAuthors)
    }
    clearer.forEach(c => c())
  }, [importantState])
}
