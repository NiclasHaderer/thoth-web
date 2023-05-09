import React from "react"
import { useAudiobookState } from "@thoth/state/audiobook.state"
import { AudiobookSelectors } from "@thoth/state/audiobook.selectors"
import { Ripple } from "@thoth/components/ripple"
import { ActiveLink } from "@thoth/components/active-link"
import { MdBook, MdCollectionsBookmark, MdPerson } from "react-icons/md"

export const BottomResourceMenu: React.FC<{ className?: string }> = ({ className = "" }) => {
  const currentLib = useAudiobookState(AudiobookSelectors.selectedLibraryId)
  return (
    <aside className="bg-surface">
      <div className={`relative flex h-16 items-center justify-between px-4 ${className}`}>
        <Ripple className="h-full flex-grow cursor-pointer bg-opacity-30" rippleClasses={"bg-primary bg-opacity-80"}>
          <ActiveLink
            href={`/libraries/${currentLib}/books`}
            withSubroutes={true}
            className="flex h-full items-center justify-center"
          >
            <MdPerson className="aspect-square h-3/5 w-auto" />
          </ActiveLink>
        </Ripple>
        <Ripple className="h-full flex-grow cursor-pointer" rippleClasses={"bg-primary bg-opacity-80"}>
          <ActiveLink
            href={`/libraries/${currentLib}/books`}
            withSubroutes={true}
            className="flex h-full items-center justify-center"
          >
            <MdBook className="aspect-square h-3/5 w-auto" />
          </ActiveLink>
        </Ripple>
        <Ripple className="h-full flex-grow cursor-pointer" rippleClasses={"bg-primary bg-opacity-80"}>
          <ActiveLink
            href={`/libraries/${currentLib}/books`}
            withSubroutes={true}
            className="flex h-full items-center justify-center"
          >
            <MdCollectionsBookmark className="aspect-square h-3/5 w-auto" />
          </ActiveLink>
        </Ripple>
      </div>
    </aside>
  )
}
