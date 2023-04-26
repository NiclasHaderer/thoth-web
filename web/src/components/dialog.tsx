import { Dialog as HDialog, Transition as HTransition } from "@headlessui/react"
import React, { Fragment, PropsWithChildren, ReactElement } from "react"
import { ColoredButton } from "./colored-button"

interface DialogProps {
  isOpen: boolean
  closeModal: () => void
  title: string
  dialogClass?: string | undefined
  children?: ReactElement | undefined
}

export const Dialog = ({ isOpen, closeModal, title, children, dialogClass }: DialogProps) => {
  return (
    <HTransition appear show={isOpen} as={Fragment}>
      <HDialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={closeModal}>
        <div className="min-h-screen px-4 text-center">
          <HTransition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <HDialog.Overlay className="fixed inset-0" />
          </HTransition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>
          <HTransition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            {/*Do not remove the transform class. This will lead to the modal closing if you click on the modal background! */}
            <div className="inline-block w-full transform overflow-hidden rounded-2xl bg-surface text-left align-middle shadow-2xl transition-all sm:max-w-full md:max-w-2xl">
              <div className={`flex flex-col bg-active-light p-6 ${dialogClass || ""}`}>
                <HDialog.Title as="h3" className="text-xl font-medium leading-6">
                  {title}
                </HDialog.Title>
                {children}
              </div>
            </div>
          </HTransition.Child>
        </div>
      </HDialog>
    </HTransition>
  )
}

export const DialogBody: React.FC<PropsWithChildren> = ({ children }) => {
  return <div className="flex grow flex-col justify-between">{children}</div>
}

export const DialogContent: React.FC<PropsWithChildren> = ({ children }) => {
  return <div>{children}</div>
}

export const DialogActions: React.FC<PropsWithChildren> = ({ children }) => {
  return <div className="mt-4 flex flex-row-reverse justify-between">{children}</div>
}

export const DialogButtons: React.VFC<{ closeModal(): void }> = ({ closeModal }) => {
  return (
    <>
      <ColoredButton type="submit">Submit</ColoredButton>
      <ColoredButton type="button" color="secondary" onClick={closeModal}>
        Cancel
      </ColoredButton>
    </>
  )
}
