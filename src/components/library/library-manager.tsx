import { PlusIcon } from "lucide-react"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { FileScanner, Library, NamedMetadataAgent, UUID } from "@thoth/client"
import { DataTable } from "@thoth/components/data-table/data-table"
import { DataTableToolbar } from "@thoth/components/data-table/data-table-toolbar"
import { Dialog } from "@thoth/components/dialog"
import { libraryColumns } from "@thoth/components/library/library-columns"
import { LibraryDialog, LibraryFormValues } from "@thoth/components/library/library-dialog"
import { Button } from "@thoth/components/ui/button"
import { DialogClose, DialogDescription, DialogFooter } from "@thoth/components/ui/dialog"
import { FormContext, useForm } from "@thoth/hooks/form"
import { useOnMount } from "@thoth/hooks/lifecycle"
import { AudiobookSelectors } from "@thoth/state/audiobook.selectors"
import { useAudiobookState } from "@thoth/state/audiobook.state"
import { apiErrorMessage } from "@thoth/utils/utils"

export const LibraryManager = () => {
  const libraries = useAudiobookState(AudiobookSelectors.libraries)
  const [isOpen, setIsOpen] = useState(false)
  const [libraryToDelete, setLibraryToDelete] = useState<Library | undefined>(undefined)
  const createLibrary = useAudiobookState(s => s.createLibrary)
  const updateLibrary = useAudiobookState(s => s.updateLibrary)
  const deleteLibrary = useAudiobookState(s => s.deleteLibrary)
  const fetchLibraries = useAudiobookState(s => s.fetchLibraries)
  useOnMount(() => void fetchLibraries())

  const form: FormContext<LibraryFormValues> = useForm(
    {
      id: undefined as undefined | UUID,
      name: "",
      language: "",
      preferEmbeddedMetadata: false as boolean,
      folders: [] as string[],
      metadataAgents: [] as NamedMetadataAgent[],
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

  const onDelete = async () => {
    if (!libraryToDelete) return
    const res = await deleteLibrary(libraryToDelete.id)
    setLibraryToDelete(undefined)
    if (!res.success) toast.error(apiErrorMessage(res.error))
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const columns = useMemo(() => libraryColumns({ onEdit: openEdit, onDelete: setLibraryToDelete }), [])

  return (
    <>
      <div className="mt-4 flex min-h-0 flex-1 flex-col">
        <DataTable
          columns={columns}
          data={libraries ?? []}
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
      <Dialog
        isOpen={libraryToDelete !== undefined}
        onOpenChange={open => !open && setLibraryToDelete(undefined)}
        title={`Delete ${libraryToDelete?.name}?`}
        className="sm:max-w-sm"
      >
        <DialogDescription>
          This permanently deletes the library and every book, series and author in it. This cannot be undone.
        </DialogDescription>
        <DialogFooter className="mt-4">
          <DialogClose>Cancel</DialogClose>
          <Button variant="destructive" onPress={onDelete}>
            Delete library
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  )
}
