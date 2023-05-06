import React, { useState } from "react"
import {
  MdAutoAwesome,
  MdEdit,
  MdFolder,
  MdGasMeter,
  MdLanguage,
  MdLibraryBooks,
  MdLocalLibrary,
  MdPerson,
  MdRadar,
} from "react-icons/md"
import { useForm } from "@thoth/hooks/form"
import { ColoredButton } from "@thoth/components/colored-button"
import { useOnMount } from "@thoth/hooks/lifecycle"
import { FileScanner, MetadataAgent } from "@thoth/client"
import { LibraryDialog, LibraryFormValues } from "@thoth/components/library-dialog"
import { useAudiobookState } from "@thoth/state/audiobook.state"
import { AudiobookSelectors } from "@thoth/state/audiobook.selectors"
import { MdScan } from "@thoth/components/icons/scan"

export const LibraryManager = () => {
  const libraries = useAudiobookState(AudiobookSelectors.libraries)
  const [isOpen, setIsOpen] = useState(false)
  const createLibrary = useAudiobookState(s => s.createLibrary)
  const updateLibrary = useAudiobookState(s => s.updateLibrary)
  const fetchLibraries = useAudiobookState(s => s.fetchLibraries)
  useOnMount(() => void fetchLibraries())

  const onSubmit = async (values: LibraryFormValues) => {
    setIsOpen(false)
    if (values.mode === "create") {
      await createLibrary(values)
    } else {
      await updateLibrary(values.id!, values)
    }
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
        metadataScanners: (metadataScanners: MetadataAgent[]) => {
          console.log(metadataScanners)
          return metadataScanners.length > 0 || "At least one metadata scanner is required"
        },
        fileScanners: (fileScanners: FileScanner[]) => {
          console.log(fileScanners)
          return fileScanners.length > 0 || "At least one file scanner is required"
        },
      },
    }
  )

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
                  <td className="pl-2">
                    <div className="flex items-center">
                      <MdLocalLibrary className="mr-4 h-8 w-8" />
                      {library.name}
                    </div>
                  </td>
                  <td className="pl-2">
                    <div className="flex items-center">
                      <MdAutoAwesome className="mr-4 h-8 w-8" />
                      {library.preferEmbeddedMetadata ? "Embedded" : "External"}
                    </div>
                  </td>
                  <td className="pl-2">
                    <div className="flex items-center">
                      <MdFolder className="mr-4 h-8 w-8" />
                      {library.folders.join(", ")}
                    </div>
                  </td>
                  <td className="pl-2">
                    <div className="flex items-center">
                      <MdRadar className="mr-4 h-8 w-8" />
                      {library.metadataScanners.map(s => s.name).join(", ")}
                    </div>
                  </td>
                  <td className="pl-2">
                    <div className="flex items-center">
                      <MdScan className="mr-4 h-8 w-8" />
                      {library.fileScanners.map(s => s.name).join(", ")}
                    </div>
                  </td>
                  <td className="pl-2">
                    <div className="flex items-center">
                      <MdLanguage className="mr-4 h-8 w-8" />
                      {library.language}
                    </div>
                  </td>
                  <td className="pr-2">
                    <div className="flex items-center">
                      <MdEdit className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
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
