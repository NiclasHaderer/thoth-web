import React, { useState } from "react"
import { MdEdit, MdFolder, MdGasMeter, MdPerson } from "react-icons/md"
import { useForm } from "@thoth/hooks/form"
import { ColoredButton } from "@thoth/components/colored-button"
import { useHttpRequest } from "@thoth/hooks/async-response"
import { Api } from "@thoth/client"
import { useOnMount } from "@thoth/hooks/lifecycle"
import { FileScanner, MetadataAgent } from "@thoth/client"
import { LibraryDialog, LibraryFormValues } from "@thoth/components/library-dialog"

export const LibraryManager = () => {
  const { invoke, error, result: libraries, loading } = useHttpRequest(Api.listLibraries)
  const [isOpen, setIsOpen] = useState(false)

  const onSubmit = async (values: LibraryFormValues) => {
    setIsOpen(false)
    if (values.mode === "create") {
      await Api.createLibrary(values)
    } else {
      await Api.updateLibrary(values.id!, values)
    }
    invoke()
  }

  const form = useForm(
    {
      id: undefined as string | undefined,
      name: "",
      language: "",
      preferEmbeddedMetadata: false,
      folders: [] as string[],
      metadataScanners: [] as MetadataAgent[],
      fileScanners: [] as FileScanner[],
      mode: "create" as "create" | "edit",
    },
    {
      validate: {
        name: (name: string) => name.length > 0 || "Name is required",
        language: (language: string) => language.length > 0 || "Language is required",
        folders: (folders: string[]) => folders.length > 0 || "At least one folder is required",
        metadataScanners: (metadataScanners: MetadataAgent[]) =>
          metadataScanners.length > 0 || "At least one metadata scanner is required",
        fileScanners: (fileScanners: FileScanner[]) =>
          fileScanners.length > 0 || "At least one file scanner is required",
      },
    }
  )
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
      <LibraryDialog onSubmit={onSubmit} isOpen={isOpen} setIsOpen={setIsOpen} form={form} />
    </>
  )
}
