import {
  Dialog as HDialog,
  DialogPanel,
  DialogTitle,
  Transition as HTransition,
  TransitionChild,
} from "@headlessui/react"
import { FC, Fragment, PropsWithChildren, ReactElement } from "react"
import { ColoredButton } from "./colored-button"

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
    <HTransition appear show={isOpen} as={Fragment}>
      <HDialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={closeModal}>
        <div className="h-screen px-4 text-center">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0" />
          </TransitionChild>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            {/* relative z-10 keeps the panel above the fixed backdrop so backdrop clicks (not content clicks) dismiss it. */}
            <DialogPanel
              className={`bg-surface relative z-10 inline-block w-full rounded-2xl text-left align-middle shadow-2xl transition-all sm:max-w-full md:max-w-2xl ${
                outerDialogClass ?? ""
              }`}
            >
              <div className={`bg-active-light flex h-full flex-col rounded-2xl p-6 ${dialogClass || ""}`}>
                <DialogTitle as="h3" className="pb-2 text-xl leading-6 font-medium">
                  {title}
                </DialogTitle>
                {children}
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </HDialog>
    </HTransition>
  )
}

export const DialogBody: FC<PropsWithChildren> = ({ children }) => {
  return <div className="flex h-4/5 grow flex-col justify-between">{children}</div>
}

export const DialogActions: FC<PropsWithChildren> = ({ children }) => {
  return <div className="mt-4 flex justify-between">{children}</div>
}

export const DialogButtons: FC<{ closeModal: () => void }> = ({ closeModal }) => {
  return (
    <>
      <ColoredButton type="button" color="secondary" onClick={closeModal}>
        Cancel
      </ColoredButton>
      <ColoredButton type="submit">Submit</ColoredButton>
    </>
  )
}
