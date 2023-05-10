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
import { FileScanner, MetadataAgent, UUID } from "@thoth/client"
import { LibraryDialog, LibraryFormValues } from "@thoth/components/library/library-dialog"
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
      id: undefined as UUID | undefined,
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
          return metadataScanners.length > 0 || "At least one metadata scanner is required"
        },
        fileScanners: (fileScanners: FileScanner[]) => {
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
      <div className="mt-4 w-full overflow-y-auto">
        <table className="w-full table-auto overflow-hidden rounded">
          <thead>
            <tr className="bg-elevate p-2 [&>*]:py-2">
              <th className="pl-2 text-left">
                <div className="flex items-center">
                  <MdLocalLibrary className="mr-4 h-6 w-6" />
                  Library
                </div>
              </th>
              <th className="pl-2 text-left">
                <div className="flex items-center">
                  <MdAutoAwesome className="mr-4 h-6 w-6" />
                  Metadata preference
                </div>
              </th>
              <th className="pl-2 text-left">
                <div className="flex items-center">
                  <MdRadar className="mr-4 h-6 w-6" />
                  Metadata scanners
                </div>
              </th>
              <th className="pl-2 text-left">
                <div className="flex items-center">
                  <MdScan className="mr-4 h-6 w-6" />
                  File scanners
                </div>
              </th>
              <th className="pl-2 text-left">
                <div className="flex items-center">
                  <MdLanguage className="mr-4 h-6 w-6" />
                  Language
                </div>
              </th>
              <th className="w-0"></th>
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
                    <td className="pl-2">{library.name}</td>
                    <td className="pl-2">{library.preferEmbeddedMetadata ? "Embedded" : "External"}</td>
                    <td className="pl-2">{library.metadataScanners.map(s => s.name).join(", ")}</td>
                    <td className="pl-2">{library.fileScanners.map(s => s.name).join(", ")}</td>
                    <td className="pl-2">{library.language}</td>
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
                  </tr>
                )}
              </>
            }
          </tbody>
        </table>
      </div>
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
