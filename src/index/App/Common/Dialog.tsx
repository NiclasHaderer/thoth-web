import { Dialog as HDialog, Transition as HTransition } from "@headlessui/react"
import { Form, Formik, FormikHelpers } from "formik"
import React, { Fragment, ReactElement } from "react"

interface DialogProps<T> {
  isOpen: boolean
  closeModal: () => void
  title: string
  buttons?: ReactElement | undefined
  values?: T
  onSubmit?: (values: T, formikHelpers: FormikHelpers<T>) => void | Promise<any>
  children?: ReactElement | undefined
}

export function Dialog<T>({ isOpen, values, closeModal, title, children, onSubmit, buttons }: DialogProps<T>) {
  return (
    <>
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
              <HDialog.Overlay className="fixed inset-0 bg-elevate" />
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
              <div className="inline-block w-full sm:max-w-full md:max-w-2xl overflow-hidden text-left align-middle transition-all shadow-2xl bg-background rounded-2xl">
                <div className="bg-light-active p-6">
                  <HDialog.Title as="h3" className="text-xl font-medium leading-6">
                    {title}
                  </HDialog.Title>
                  <Formik
                    initialValues={values || {}}
                    onSubmit={(values, formikHelpers) =>
                      onSubmit && onSubmit(values as T, formikHelpers as FormikHelpers<T>)
                    }
                  >
                    <Form>
                      <InputContent children={children} buttons={buttons} />
                    </Form>
                  </Formik>
                </div>
              </div>
            </HTransition.Child>
          </div>
        </HDialog>
      </HTransition>
    </>
  )
}

const InputContent: React.FC<{ buttons?: ReactElement | undefined }> = ({ children, buttons }) => (
  <>
    <div className="mt-2">{children}</div>

    <div className="flex flex-row-reverse justify-between mt-4">{buttons}</div>
  </>
)
