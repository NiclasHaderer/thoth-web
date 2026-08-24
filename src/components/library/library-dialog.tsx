import { useQuery } from "@tanstack/react-query"
import {
  ChevronsRightIcon,
  ChevronsLeftIcon,
  SparklesIcon,
  XIcon,
  FolderIcon,
  LanguagesIcon,
  LibraryIcon,
  ChevronLeftIcon,
  RadarIcon,
  ScanLineIcon,
} from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { FC, useState } from "react"
import { Api, FileScanner, MetadataLanguage, NamedMetadataAgent, UUID, unwrap } from "@thoth/client"
import { Dialog } from "@thoth/components/dialog"
import { FolderManager } from "@thoth/components/file-manager"
import { InputError } from "@thoth/components/input/input-error"
import { ManagedInput } from "@thoth/components/input/managed-input"
import { SelectLine } from "@thoth/components/input/select-line"
import { Button } from "@thoth/components/ui/button"
import { DialogFooter } from "@thoth/components/ui/dialog"
import { Form, FormContext } from "@thoth/hooks/form"
import { useBreakpoint } from "@thoth/hooks/use-media-query"
import { queryKeys } from "@thoth/queries/keys"
import { unique } from "@thoth/utils/utils"

// The `satisfies Record<MetadataLanguage, ...>` forces every union member to be
// listed (missing -> "property missing", typo/extra -> "unknown property").
const LANGUAGES = Object.keys({
  Spanish: 0,
  English: 0,
  German: 0,
  French: 0,
  Italian: 0,
  Danish: 0,
  Finnish: 0,
  Norwegian: 0,
  Swedish: 0,
  Russian: 0,
} satisfies Record<MetadataLanguage, unknown>) as MetadataLanguage[]

export type LibraryFormValues = {
  id: UUID | undefined
  name: string
  language: string
  preferEmbeddedMetadata: boolean
  folders: string[]
  metadataAgents: NamedMetadataAgent[]
  fileScanners: FileScanner[]
  mode: "create" | "edit"
  icon: string | undefined
}

interface LibraryDialogProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  onSubmit: (library: LibraryFormValues) => void
  form: FormContext<LibraryFormValues>
}

export const LibraryDialog: FC<LibraryDialogProps> = ({ isOpen, setIsOpen, form, onSubmit }) => {
  const { data: availableAgents } = useQuery({
    queryKey: queryKeys.metadataAgents,
    queryFn: () => unwrap(Api.listMetadataAgents()),
    meta: { action: "load metadata agents" },
  })
  const { data: fileScanners } = useQuery({
    queryKey: queryKeys.fileScanners,
    queryFn: () => unwrap(Api.listFileScanners()),
    meta: { action: "load file scanners" },
  })
  const [browserOpen, setBrowserOpen] = useState(false)
  const isDesktop = useBreakpoint("sm")

  const formFields = (
    <>
      <ManagedInput
        labelClassName="w-28"
        label="Library name"
        name="name"
        leftIcon={<LibraryIcon />}
        placeholder="Enter a name for the library"
        autoFocus
      />
      <SelectLine
        labelClassName="w-28"
        label="Language"
        icon={<LanguagesIcon />}
        name="language"
        title={"Language"}
        options={LANGUAGES}
      />
      <SelectLine
        labelClassName="w-28"
        title="Metadata preference"
        label="Metadata"
        name="preferEmbeddedMetadata"
        icon={<SparklesIcon />}
        options={[
          { label: "Embedded", value: true },
          { label: "External", value: false },
        ]}
      />
      <SelectLine
        title={"Metadata scanners"}
        labelClassName="w-28"
        label="Metadata"
        name="metadataAgents"
        icon={<RadarIcon />}
        multiple={true}
        options={availableAgents?.map(agent => ({ value: { name: agent.name }, label: agent.name })) ?? []}
      />
      <SelectLine
        labelClassName="w-28"
        label="File"
        icon={<ScanLineIcon />}
        name="fileScanners"
        title={"File scanners"}
        multiple={true}
        options={fileScanners?.map(a => ({ value: a, label: a.name })) ?? []}
      />

      <div className="mt-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="text-muted-foreground text-sm font-medium">Folders</h3>
          <Button
            variant="secondary"
            size="icon-sm"
            aria-label={browserOpen ? "Close folder browser" : "Add folder"}
            onPress={() => setBrowserOpen(!browserOpen)}
          >
            {browserOpen ? <ChevronsLeftIcon /> : <ChevronsRightIcon />}
          </Button>
        </div>
        {form.fields.folders.length === 0 ? (
          <Button
            variant="ghost"
            isDisabled={browserOpen}
            onPress={() => setBrowserOpen(true)}
            className="text-muted-foreground h-32 w-full rounded-lg text-sm font-normal"
          >
            No folders added yet
          </Button>
        ) : (
          <div className="h-32 overflow-auto">
            <div className="flex w-max min-w-full flex-col gap-1.5">
              {form.fields.folders.map((folder, index) => (
                <div
                  key={index}
                  className="bg-card flex items-center gap-2 rounded px-2 py-1 text-sm whitespace-nowrap"
                >
                  <FolderIcon className="size-4 shrink-0" aria-hidden />
                  <span className="grow" title={folder}>
                    {folder}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="shrink-0"
                    aria-label={`Remove folder ${folder}`}
                    onPress={() => {
                      const folders = [...form.fields.folders]
                      folders.splice(index, 1)
                      form.setFields({ folders })
                    }}
                  >
                    <XIcon />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        <InputError errors={form.errors["folders"]} show={form.touched.folders} className="justify-start" />
      </div>
    </>
  )

  const folderBrowser = (
    <>
      {/* Desktop: chevron sitting on the column divider. */}
      <Button
        variant="outline"
        size="icon-sm"
        aria-label="Close folder browser"
        onPress={() => setBrowserOpen(false)}
        className="bg-popover hover:bg-accent dark:bg-popover dark:hover:bg-accent absolute top-1/2 left-0 z-10 hidden size-6 -translate-x-1/2 -translate-y-1/2 rounded-full sm:flex"
      >
        <ChevronLeftIcon />
      </Button>
      {/* Mobile: back button. */}
      <Button variant="ghost" size="sm" onPress={() => setBrowserOpen(false)} className="mb-2 self-start sm:hidden">
        <ChevronLeftIcon />
        Back
      </Button>
      <FolderManager
        contentClassName="h-80 overflow-y-auto"
        onSelectFolder={path => {
          form.setFields({ folders: unique([...form.fields.folders, path]) })
        }}
        onRemoveFolder={path => {
          form.setFields({ folders: form.fields.folders.filter(folder => folder !== path) })
        }}
        errors={undefined}
        selectedFolders={form.fields.folders}
      />
    </>
  )

  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      title={form.fields.mode === "create" ? "Create new Library" : "Edit Library"}
      className={browserOpen ? "sm:max-w-[min(95vw,72rem)]" : undefined}
    >
      <Form
        form={form}
        onSubmit={onSubmit}
        onSubmitError={errors => {
          if ("folders" in errors) setBrowserOpen(true)
        }}
      >
        {isDesktop ? (
          <div className="flex max-h-[70vh] min-w-0 gap-4 overflow-y-auto p-1">
            <div className={`flex min-w-0 flex-col ${browserOpen ? "w-2/5 shrink-0" : "grow"}`}>{formFields}</div>
            {browserOpen && (
              <div className="border-border animate-in fade-in slide-in-from-right-4 relative flex min-w-0 flex-1 flex-col border-l pl-4 duration-200">
                {folderBrowser}
              </div>
            )}
          </div>
        ) : (
          <div className="relative min-w-0 overflow-hidden">
            <AnimatePresence initial={false} mode="popLayout">
              {browserOpen ? (
                <motion.div
                  key="browser"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ duration: 0.2 }}
                  className="relative flex max-h-[70vh] min-w-0 flex-col overflow-y-auto p-1"
                >
                  {folderBrowser}
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ duration: 0.2 }}
                  className="flex max-h-[70vh] min-w-0 flex-col overflow-y-auto p-1"
                >
                  {formFields}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
        <DialogFooter>
          <Button type="button" variant="secondary" onPress={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button type="submit">Submit</Button>
        </DialogFooter>
      </Form>
    </Dialog>
  )
}
