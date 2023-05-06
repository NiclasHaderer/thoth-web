"use client"
import { useAudiobookState } from "@thoth/state/audiobook.state"
import { AudiobookSelectors } from "@thoth/state/audiobook.selectors"
import { useOnMount } from "@thoth/hooks/lifecycle"

export default function LibrariesOutlet() {
  const libraries = useAudiobookState(AudiobookSelectors.libraries)
  const fetchLibraries = useAudiobookState(s => s.fetchLibraries)
  useOnMount(() => void fetchLibraries())
  return (
    <>
      <h1>Libraries</h1>
      <ul>
        {libraries.map(library => (
          <li key={library.id}>{library.name}</li>
        ))}
      </ul>
    </>
  )
}
