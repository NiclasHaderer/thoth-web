import { FC, PropsWithChildren } from "react"
import { Button } from "@thoth/components/ui/button"
import { Tooltip, TooltipTrigger } from "@thoth/components/ui/tooltip"
import { cn } from "@thoth/lib/utils"

export const PlayerButton: FC<
  PropsWithChildren<{ label: string; className: string; onPress: () => void; isDisabled?: boolean }>
> = ({ label, className, onPress, isDisabled, children }) => (
  <TooltipTrigger>
    <Button
      variant="ghost"
      size="icon"
      aria-label={label}
      onPress={onPress}
      isDisabled={isDisabled}
      className={cn("[&_svg]:stroke-[1.5]", className)}
    >
      {children}
    </Button>
    <Tooltip>{label}</Tooltip>
  </TooltipTrigger>
)
