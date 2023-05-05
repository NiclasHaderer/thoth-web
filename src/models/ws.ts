import { UUID } from "@thoth/client"

type EntityChangeType = "Created" | "Updated" | "Removed"

export interface ChangeEvent {
  libraryId: UUID
  id: UUID
  type: EntityChangeType
}
