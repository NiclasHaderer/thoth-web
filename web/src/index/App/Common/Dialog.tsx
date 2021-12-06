import { Dialog as HDialog, Transition } from '@headlessui/react';
import React, { Fragment, ReactNode } from 'react';

interface DialogProps {
  isOpen: boolean;
  closeModal: () => void;
  title: string;
  buttons?: ReactNode | undefined;
}

export const Dialog: React.FC<DialogProps> = ({isOpen, closeModal, title, children, buttons}) => {
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <HDialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={closeModal}>
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <HDialog.Overlay className="fixed inset-0 bg-elevate"/>
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div
                className="inline-block w-full sm:max-w-full md:max-w-2xl overflow-hidden text-left align-middle transition-all transform shadow-2xl bg-background rounded-2xl">
                <div className="bg-light-active p-6">
                  <HDialog.Title as="h3" className="text-xl font-medium leading-6">
                    {title}
                  </HDialog.Title>
                  <div className="mt-2">
                    {children}
                  </div>

                  <div className="mt-4">
                    {buttons}
                  </div>
                </div>
              </div>

            </Transition.Child>
          </div>
        </HDialog>
      </Transition>
    </>
  );
};
