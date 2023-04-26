import { UUID } from "@thoth/models/api-models"

type EntityChangeType = "Created" | "Updated" | "Removed"

export interface ChangeEvent {
  libraryId: UUID
  id: UUID
  type: EntityChangeType
}
