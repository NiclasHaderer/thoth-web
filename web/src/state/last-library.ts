import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { UUID } from "@dewey/client"
import { persistKey } from "@dewey/client/persistence"

interface LastLibrary {
  lastLibraryId?: UUID
}

// Per tab, so two tabs in different libraries keep their own navigation.
export const useLastLibrary = create<LastLibrary>()(
  persist((): LastLibrary => ({}), {
    name: persistKey("last-library"),
    storage: createJSONStorage(() => sessionStorage),
  })
)

export const setLastLibraryId = (lastLibraryId: UUID) => useLastLibrary.setState({ lastLibraryId })
