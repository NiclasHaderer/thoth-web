"use client"
import { useAudiobookState } from "@thoth/state/audiobook.state"
import { AudiobookSelectors } from "@thoth/state/audiobook.selectors"
import { useOnMount } from "@thoth/hooks/lifecycle"
import { useRouter } from "next/navigation"

export default function LibrariesOutlet() {
  const libraries = useAudiobookState(AudiobookSelectors.libraries)
  const fetchLibraries = useAudiobookState(s => s.fetchLibraries)
  const router = useRouter()
  useOnMount(() => {
    fetchLibraries().then(() => {
      if (libraries.length > 0) return
      router.push("/settings")
    })
  })
  return (
    <>
      <h1>Libraries</h1>
      <div>
        {libraries.map(library => (
          <div key={library.id}>{library.name}</div>
        ))}
      </div>
    </>
  )
}
