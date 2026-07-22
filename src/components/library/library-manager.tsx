import { PlusIcon } from "lucide-react"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { FileScanner, Library, NamedMetadataAgent, UUID } from "@thoth/client"
import { DataTable } from "@thoth/components/data-table/data-table"
import { DataTableToolbar } from "@thoth/components/data-table/data-table-toolbar"
import { libraryColumns } from "@thoth/components/library/library-columns"
import { LibraryDialog, LibraryFormValues } from "@thoth/components/library/library-dialog"
import { Button } from "@thoth/components/ui/button"
import { FormContext, useForm } from "@thoth/hooks/form"
import { useOnMount } from "@thoth/hooks/lifecycle"
import { AudiobookSelectors } from "@thoth/state/audiobook.selectors"
import { useAudiobookState } from "@thoth/state/audiobook.state"
import { apiErrorMessage } from "@thoth/utils/utils"

export const LibraryManager = () => {
  const libraries = useAudiobookState(AudiobookSelectors.libraries)
  const [isOpen, setIsOpen] = useState(false)
  const createLibrary = useAudiobookState(s => s.createLibrary)
  const updateLibrary = useAudiobookState(s => s.updateLibrary)
  const fetchLibraries = useAudiobookState(s => s.fetchLibraries)
  useOnMount(() => void fetchLibraries())

  const form: FormContext<LibraryFormValues> = useForm(
    {
      id: undefined as undefined | UUID,
      name: "",
      language: "",
      preferEmbeddedMetadata: false as boolean,
      folders: [] as string[],
      metadataScanners: [] as NamedMetadataAgent[],
      fileScanners: [] as FileScanner[],
      mode: "create" as "create" | "edit",
      icon: undefined as string | undefined,
    } satisfies LibraryFormValues,
    {
      validate: {
        name: (name: string) => name.length > 0 || "Name is required",
        language: (language: string) => language.length > 0 || "Language is required",
        folders: (folders: string[]) => folders.length > 0 || "At least one folder is required",
        fileScanners: (fileScanners: FileScanner[]) => {
          return fileScanners.length > 0 || "At least one file scanner is required"
        },
      },
    }
  )

  const onSubmit = async (values: LibraryFormValues) => {
    const res = values.mode === "create" ? await createLibrary(values) : await updateLibrary(values.id!, values)
    if (res.success) {
      setIsOpen(false)
    } else {
      toast.error(apiErrorMessage(res.error))
    }
  }

  const openEdit = (library: Library) => {
    form.setAllFields({ ...library, mode: "edit" })
    setIsOpen(true)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const columns = useMemo(() => libraryColumns({ onEdit: openEdit }), [])

  // TEMP: mock 100 libraries to preview the table/pagination layout.
  const mockLibraries = useMemo<Library[]>(() => {
    const real = libraries ?? []
    if (real.length === 0) return real
    return Array.from({ length: 100 }, (_, i) => ({
      ...real[i % real.length],
      id: `mock-${i}` as UUID,
      name: `${real[i % real.length].name} ${i}`,
    }))
  }, [libraries])

  return (
    <>
      <div className="mt-4">
        <DataTable
          columns={columns}
          data={mockLibraries}
          onRowClick={openEdit}
          emptyState="No library yet"
          toolbar={table => (
            <DataTableToolbar table={table} searchColumnId="name" searchPlaceholder="Filter libraries...">
              <Button
                size="sm"
                className="h-8"
                aria-label="Create new Library"
                onPress={() => {
                  form.restoreInitial()
                  setIsOpen(true)
                }}
              >
                <PlusIcon />
                <span className="hidden sm:inline">Create new Library</span>
              </Button>
            </DataTableToolbar>
          )}
        />
      </div>
      <LibraryDialog onSubmit={onSubmit} isOpen={isOpen} setIsOpen={setIsOpen} form={form} />
    </>
  )
}
