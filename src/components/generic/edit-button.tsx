import { PencilIcon } from "lucide-react"
import { FC } from "react"
import { Button } from "@thoth/components/ui/button"

export const EditButton: FC<{ onPress: () => void }> = ({ onPress }) => (
  <Button variant="secondary" onPress={onPress} className="max-sm:w-11 max-sm:px-0">
    <PencilIcon className="sm:mr-2" />
    <span className="max-sm:sr-only">Edit</span>
  </Button>
)
