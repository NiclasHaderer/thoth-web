import React, { FC, useState } from "react"
import {
  MdAutoAwesome,
  MdEdit,
  MdFolder,
  MdGasMeter,
  MdLanguage,
  MdLocalLibrary,
  MdPerson,
  MdRadar,
  MdScanner,
} from "react-icons/md"
import { Form, FormContext, useForm } from "@thoth/hooks/form"
import { ColoredButton } from "@thoth/components/colored-button"
import { useHttpRequest } from "@thoth/hooks/async-response"
import { Api } from "@thoth/client"
import { useOnMount } from "@thoth/hooks/lifecycle"
import { FileScanner, MetadataAgent } from "@thoth/models/api-models"
import { Dialog, DialogActions, DialogBody, DialogButtons } from "@thoth/components/dialog"
import { ManagedInput } from "@thoth/components/input/managed-input"
import { SelectLine } from "@thoth/components/input/select-line"
import { MdScan } from "@thoth/components/icons/scan"

export const LibraryManager = () => {
  const { invoke, error, result: libraries, loading } = useHttpRequest(Api.listLibraries)
  const [isOpen, setIsOpen] = useState(false)
  const form = useForm({
    id: undefined as string | undefined,
    name: "",
    language: "",
    preferEmbeddedMetadata: false,
    folders: [] as string[],
    metadataScanners: [] as MetadataAgent[],
    fileScanners: [] as FileScanner[],
    mode: "create" as "create" | "edit",
  })
  useOnMount(() => invoke())

  return (
    <>
      <p>
        As a user of our audiobook website, you can now browse and listen to audiobooks in multiple languages. As an
        admin, you have the ability to create separate audiobook libraries for different languages, allowing users to
        easily find and listen to audiobooks in their preferred language.
      </p>
      <table className="w-full table-auto overflow-hidden rounded">
        <thead>
          <tr className="bg-elevate">
            <th className="pl-2 text-left">Library</th>
            <th className="pl-2 text-left">Metadata preference</th>
            <th className="pl-2 text-left">Folders</th>
            <th className="pl-2 text-left">Metadata scanners</th>
            <th className="pl-2 text-left">File scanners</th>
            <th className="pl-2 text-left">Language</th>
            <th className="w-0 pr-2 text-left"></th>
          </tr>
        </thead>
        <tbody>
          {
            <>
              {libraries?.map(library => (
                <tr
                  className="group cursor-pointer odd:bg-active-light hover:bg-active"
                  key={library.id}
                  onClick={() => {
                    form.setFields({ ...library, mode: "edit" })
                    setIsOpen(true)
                  }}
                >
                  <td className="flex items-center pl-2">
                    <MdPerson className="mr-4 h-8 w-8" />
                    {library.name}
                  </td>
                  <td className="flex items-center pl-2">
                    <MdGasMeter className="mr-4 h-8 w-8" />
                    {library.preferEmbeddedMetadata ? "Embedded" : "External"}
                  </td>
                  <td className="flex items-center pl-2">
                    <MdFolder className="mr-4 h-8 w-8" />
                    {library.folders.join(", ")}
                  </td>
                  <td className="flex items-center pl-2">
                    <MdFolder className="mr-4 h-8 w-8" />
                    {library.metadataScanners.join(", ")}
                  </td>
                  <td className="flex items-center pl-2">
                    <MdFolder className="mr-4 h-8 w-8" />
                    {library.fileScanners.join(", ")}
                  </td>
                  <td className="flex items-center pl-2">
                    <MdFolder className="mr-4 h-8 w-8" />
                    {library.language}
                  </td>
                  <td className="pr-2">
                    <MdEdit className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  </td>
                </tr>
              ))}
              {(!libraries || libraries.length === 0) && (
                <tr className="odd:bg-active-light">
                  <td className="pl-2">No library yet</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              )}
            </>
          }
        </tbody>
      </table>
      <div className="flex justify-end pt-2">
        <ColoredButton
          onClick={() => {
            form.restoreInitial()
            setIsOpen(true)
          }}
          innerClassName="!p-.5"
        >
          Create new Library
        </ColoredButton>
      </div>
      <LibraryDialog isOpen={isOpen} setIsOpen={setIsOpen} form={form} />
    </>
  )
}

export const LibraryDialog: FC<{
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  form: FormContext<{
    id: string | undefined
    name: string
    language: string
    preferEmbeddedMetadata: boolean
    folders: string[]
    metadataScanners: MetadataAgent[]
    fileScanners: FileScanner[]
    mode: "create" | "edit"
  }>
}> = ({ isOpen, setIsOpen, form }) => {
  return (
    <Dialog
      isOpen={isOpen}
      closeModal={() => setIsOpen(false)}
      title={form.fields.mode === "create" ? "Create new Library" : "Edit Library"}
    >
      <Form form={form}>
        <DialogBody>
          <ManagedInput
            labelClassName="w-28"
            label="Library name"
            name="name"
            icon={<MdLocalLibrary />}
            placeholder="Enter a name for the library"
            required
            autoFocus
          />

          <ManagedInput
            labelClassName="w-28"
            label="Language"
            icon={<MdLanguage />}
            name="language"
            placeholder="Enter the language of the library"
            required
          />
          <SelectLine
            labelClassName="w-28"
            title="Metadata preference"
            label="Metadata"
            name="preferEmbeddedMetadata"
            icon={<MdAutoAwesome />}
            options={[
              { label: "Embedded", value: true },
              { label: "External", value: false },
            ]}
          />
          <ManagedInput
            labelClassName="w-28"
            label="Folders"
            name="folders"
            icon={<MdFolder />}
            placeholder="Enter the folders to scan"
            required
          />
          <ManagedInput
            labelClassName="w-28"
            label="Metadata"
            name="metadataScanners"
            icon={<MdRadar />}
            placeholder="Enter the metadata scanners to use"
            required
          />
          <ManagedInput
            labelClassName="w-28"
            label="File"
            icon={<MdScan />}
            name="fileScanners"
            placeholder="Enter the file scanners to use"
            required
          />
        </DialogBody>
        <DialogActions>
          <DialogButtons closeModal={() => setIsOpen(false)} />
        </DialogActions>
      </Form>
    </Dialog>
  )
}
