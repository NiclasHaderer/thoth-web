import { FC, useEffect, useState } from "react"
import { MdAutoAwesome, MdClose, MdFolder, MdLanguage, MdLocalLibrary, MdRadar, MdSettings } from "react-icons/md"
import { Api, FileScanner, MetadataLanguage, NamedMetadataAgent, UUID } from "@thoth/client"
import { Dialog, DialogBody, DialogButtons, DialogFooter } from "@thoth/components/dialog"
import { FolderManager } from "@thoth/components/file-manager"
import { MdScan } from "@thoth/components/icons/scan"
import { InputError } from "@thoth/components/input/input-error"
import { ManagedInput } from "@thoth/components/input/managed-input"
import { SelectLine } from "@thoth/components/input/select-line"
import { LeftTabs, TabContent } from "@thoth/components/left-tabs"
import { Button } from "@thoth/components/ui/button"
import { useHttpRequest } from "@thoth/hooks/async-response"
import { Form, FormContext, SubmitError } from "@thoth/hooks/form"
import { useOnMount } from "@thoth/hooks/lifecycle"
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
  metadataScanners: NamedMetadataAgent[]
  fileScanners: FileScanner[]
  mode: "create" | "edit"
  icon: string | undefined
}

interface LibraryDialogProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  onSubmit: (library: LibraryFormValues) => void
  form: FormContext<LibraryFormValues>
  submitError?: string | null
}

export const LibraryDialog: FC<LibraryDialogProps> = ({ isOpen, setIsOpen, form, onSubmit, submitError }) => {
  const metadataAgents = useHttpRequest(Api.listMetadataAgents)
  const fileScanners = useHttpRequest(Api.listFileScanners)
  const [activeTab, setActiveTab] = useState(0)
  useOnMount(() => {
    void fileScanners.invoke()
  })
  useEffect(() => {
    void metadataAgents.invoke({ language: form.fields.language })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.fields.language])

  // Drop selected scanners that the newly fetched language no longer offers.
  useEffect(() => {
    if (!metadataAgents.result) return
    const available = new Set(metadataAgents.result.map(a => a.name))
    const filtered = form.fields.metadataScanners.filter(a => available.has(a.name))
    if (filtered.length !== form.fields.metadataScanners.length) {
      form.setFields({ metadataScanners: filtered })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metadataAgents.result])

  const switchToRightTab = (errors: SubmitError<LibraryFormValues>) => {
    const errorFields = Object.keys(errors)
    if (errorFields.length === 1 && errorFields[0] === "folders") {
      setActiveTab(1)
    } else if (!errorFields.includes("folders")) {
      setActiveTab(0)
    }
  }

  return (
    <Dialog
      isOpen={isOpen}
      closeModal={() => setIsOpen(false)}
      title={form.fields.mode === "create" ? "Create new Library" : "Edit Library"}
      outerDialogClass="w-3/5 lg:max-w-[75%]! xl:max-w-[50%]! max-w-[95%]!"
      dialogClass="h-[70vh]"
    >
      <Form form={form} onSubmit={onSubmit} onSubmitError={switchToRightTab}>
        <DialogBody>
          <LeftTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            rightClassname="h-full"
            tabs={[
              <div className="flex items-center" key={1}>
                <MdSettings className="mr-2" />
                Settings
              </div>,
              <div className="flex items-center" key={2}>
                <MdFolder className="mr-2" />
                Folders
              </div>,
            ]}
            className="h-full"
          >
            <TabContent>
              <ManagedInput
                labelClassName="w-28"
                label="Library name"
                name="name"
                leftIcon={<MdLocalLibrary />}
                placeholder="Enter a name for the library"
                autoFocus
              />

              <SelectLine
                labelClassName="w-28"
                label="Language"
                icon={<MdLanguage />}
                name="language"
                title={"Language"}
                options={LANGUAGES}
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
              <SelectLine
                title={"Metadata scanners"}
                labelClassName="w-28"
                label="Metadata"
                name="metadataScanners"
                icon={<MdRadar />}
                multiple={true}
                options={
                  metadataAgents?.result?.map(a => ({
                    value: a,
                    label: a.name,
                  })) ?? []
                }
              />
              <SelectLine
                labelClassName="w-28"
                label="File"
                icon={<MdScan />}
                name="fileScanners"
                title={"File scanners"}
                multiple={true}
                options={
                  fileScanners?.result?.map(a => ({
                    value: a,
                    label: a.name,
                  })) ?? []
                }
              />
            </TabContent>
            <TabContent>
              <div className="flex h-full gap-4">
                <div className="flex h-full min-w-1/2 flex-col overflow-hidden">
                  <h3 className="mb-3 text-xl">Library folders</h3>
                  <div className="flex grow flex-col gap-2 overflow-y-auto">
                    {form.fields.folders.length === 0 ? (
                      <div className="text-sm opacity-60">No folders added yet</div>
                    ) : (
                      form.fields.folders.map((folder, index) => (
                        <div key={index} className="bg-card flex items-center gap-2 rounded p-1 pl-2">
                          <MdFolder className="shrink-0" aria-hidden />
                          <span className="grow truncate" title={folder}>
                            {folder}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="shrink-0"
                            aria-label={`Remove folder ${folder}`}
                            onPress={() => {
                              const folders = [...form.fields.folders]
                              folders.splice(index, 1)
                              form.setFields({ folders })
                            }}
                          >
                            <MdClose />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <FolderManager
                  className="min-w-1/2 grow justify-between"
                  contentClassName="h-4/5 overflow-y-auto"
                  onSelectFolder={path => {
                    form.setFields({ folders: unique([...form.fields.folders, path]) })
                  }}
                  errors={form.errors["folders"]}
                  selectedFolders={form.fields.folders}
                />
              </div>
            </TabContent>
          </LeftTabs>
        </DialogBody>
        <InputError errors={submitError} className="justify-start" />
        <DialogFooter>
          <DialogButtons closeModal={() => setIsOpen(false)} />
        </DialogFooter>
      </Form>
    </Dialog>
  )
}
