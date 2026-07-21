import { FC, PropsWithChildren, ReactElement } from "react"
import { Button } from "@thoth/components/ui/button"
import { Dialog as UIDialog, DialogFooter as UIDialogFooter, DialogTitle } from "@thoth/components/ui/dialog"
import { cn } from "@thoth/lib/utils"

interface DialogProps {
  isOpen: boolean
  closeModal: () => void
  title: string
  dialogClass?: string | undefined
  outerDialogClass?: string | undefined
  children?: ReactElement | undefined
}

export const Dialog = ({ isOpen, closeModal, title, children, dialogClass, outerDialogClass }: DialogProps) => {
  return (
    <UIDialog
      isOpen={isOpen}
      onOpenChange={open => {
        if (!open) closeModal()
      }}
      showCloseButton={false}
      className={cn(
        "bg-muted grid max-h-[85vh] w-full max-w-[calc(100%-2rem)] overflow-hidden rounded-2xl p-0 text-left shadow-2xl sm:max-w-full md:max-w-2xl",
        outerDialogClass
      )}
    >
      <div className={cn("flex max-h-[85vh] w-full min-w-0 flex-col", dialogClass)}>
        <DialogTitle className="shrink-0 px-6 pt-6 pb-2 text-xl leading-6 font-medium">{title}</DialogTitle>
        {children}
      </div>
    </UIDialog>
  )
}

export const DialogBody: FC<PropsWithChildren> = ({ children }) => {
  return <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-y-auto px-6 py-2">{children}</div>
}

export const DialogFooter: FC<PropsWithChildren> = ({ children }) => {
  return <UIDialogFooter className="mx-0 mt-0 mb-0 shrink-0 rounded-b-2xl px-6">{children}</UIDialogFooter>
}

export const DialogButtons: FC<{ closeModal: () => void }> = ({ closeModal }) => {
  return (
    <>
      <Button type="button" variant="secondary" onPress={closeModal}>
        Cancel
      </Button>
      <Button type="submit">Submit</Button>
    </>
  )
}
