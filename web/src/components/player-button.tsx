import { cn } from "cn"
import { FC, PropsWithChildren, useState } from "react"
import { PlayerPressContext } from "@dewey/components/player-icons"
import { Button } from "@dewey/components/ui/button"

export const PlayerButton: FC<
  PropsWithChildren<{ label: string; className: string; onPress: () => void; isDisabled?: boolean }>
> = ({ label, className, onPress, isDisabled, children }) => {
  const [presses, setPresses] = useState(0)
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={label}
      onPress={() => {
        setPresses(count => count + 1)
        onPress()
      }}
      isDisabled={isDisabled}
      className={cn("[&_svg]:stroke-[1.5]", className)}
    >
      <PlayerPressContext.Provider value={presses}>{children}</PlayerPressContext.Provider>
    </Button>
  )
}
