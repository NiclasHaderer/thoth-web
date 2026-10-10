import { create } from "zustand"
import { persist } from "zustand/middleware"
import { UUID } from "@thoth/client"
import { persistKey } from "@thoth/client/persistence"

export interface Resume {
  libraryId: UUID
  bookId: UUID
  positionMs: number
}

interface ResumeState {
  resume: Resume | null
}

export const usePlaybackResume = create<ResumeState>()(
  persist((): ResumeState => ({ resume: null }), { name: persistKey("playback-resume"), version: 1 })
)
