import { PlusIcon } from "lucide-react"
import { useMemo, useState } from "react"
import { FileScanner, Library, MetadataLanguage, MetadataRegion, NamedMetadataAgent, UUID } from "@thoth/client"
import { DataTable } from "@thoth/components/data-table/data-table"
import { DataTableToolbar } from "@thoth/components/data-table/data-table-toolbar"
import { libraryColumns } from "@thoth/components/library/library-columns"
import { LibraryDialog, LibraryFormValues } from "@thoth/components/library/library-dialog"
import { TitledDialog } from "@thoth/components/titled-dialog"
import { Button } from "@thoth/components/ui/button"
import { DialogClose, DialogDescription, DialogFooter } from "@thoth/components/ui/dialog"
import { FormContext, useForm } from "@thoth/hooks/use-form"
import { useCreateLibrary, useDeleteLibrary, useLibraries, useUpdateLibrary } from "@thoth/queries/library-queries"
import { changedFields } from "@thoth/utils/changed-fields"

export const LibraryManager = () => {
  const { data: libraries } = useLibraries()
  const [isOpen, setIsOpen] = useState(false)
  const [libraryToDelete, setLibraryToDelete] = useState<Library | undefined>(undefined)
  const createLibrary = useCreateLibrary()
  const updateLibrary = useUpdateLibrary()
  const deleteLibrary = useDeleteLibrary()

  const form: FormContext<LibraryFormValues> = useForm(
    {
      id: undefined as undefined | UUID,
      name: "",
      language: "" as MetadataLanguage | "",
      region: "" as MetadataRegion | "",
      preferEmbeddedMetadata: false as boolean,
      folders: [] as string[],
      metadataAgents: [] as NamedMetadataAgent[],
      fileScanners: [] as FileScanner[],
      // TODO add these to the library creation dialog
      combineMetadataAgentFields: false as boolean,
      combineFileScannerFields: false as boolean,
      mode: "create" as "create" | "edit",
      icon: null as string | null,
    } satisfies LibraryFormValues,
    {
      validate: {
        name: (name: string) => name.length > 0 || "Name is required",
        language: (language: string) => language.length > 0 || "Language is required",
        region: (region: string) => region.length > 0 || "Region is required",
        folders: (folders: string[]) => folders.length > 0 || "At least one folder is required",
        fileScanners: (fileScanners: FileScanner[]) => {
          return fileScanners.length > 0 || "At least one file scanner is required"
        },
      },
    }
  )

  const onSubmit = ({ language, region, mode, id, ...values }: LibraryFormValues) => {
    if (!language || !region) return
    const handlers = { onSuccess: () => setIsOpen(false) }
    const library = { ...values, language, region }
    if (mode === "create") return createLibrary.mutate(library, handlers)
    const saved = libraries!.find(saved => saved.id === id)!
    updateLibrary.mutate({ id: saved.id, library: changedFields(saved, library) }, handlers)
  }

  const openEdit = (library: Library) => {
    form.setAllFields({ ...library, mode: "edit" })
    setIsOpen(true)
  }

  const onDelete = () => {
    if (!libraryToDelete) return
    deleteLibrary.mutate(libraryToDelete.id)
    setLibraryToDelete(undefined)
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
      <TitledDialog
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
      </TitledDialog>
    </>
  )
}
