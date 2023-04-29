import { FC } from "react"
import { Form, FormContext } from "@thoth/hooks/form"
import { FileScanner, MetadataAgent } from "@thoth/models/api-models"
import { useHttpRequest } from "@thoth/hooks/async-response"
import { Api } from "@thoth/client"
import { useOnMount } from "@thoth/hooks/lifecycle"
import { Dialog, DialogActions, DialogBody, DialogButtons } from "@thoth/components/dialog"
import { LeftTabs, TabContent } from "@thoth/components/left-tabs"
import { MdAutoAwesome, MdClose, MdFolder, MdLanguage, MdLocalLibrary, MdRadar, MdSettings } from "react-icons/md"
import { ManagedInput } from "@thoth/components/input/managed-input"
import { SelectLine } from "@thoth/components/input/select-line"
import { unique } from "@thoth/utils"
import { MdScan } from "@thoth/components/icons/scan"
import { FolderManager } from "@thoth/components/file-manager"

export type LibraryFormValues = {
  id: string | undefined
  name: string
  language: string
  preferEmbeddedMetadata: boolean
  folders: string[]
  metadataScanners: MetadataAgent[]
  fileScanners: FileScanner[]
  mode: "create" | "edit"
}

interface LibraryDialogProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  onSubmit: (values: LibraryFormValues) => void
  form: FormContext<LibraryFormValues>
}

export const LibraryDialog: FC<LibraryDialogProps> = ({ isOpen, setIsOpen, form, onSubmit }) => {
  const metadataAgents = useHttpRequest(Api.listMetadataAgents)
  const fileScanners = useHttpRequest(Api.listFileScanners)
  useOnMount(() => {
    metadataAgents.invoke()
    fileScanners.invoke()
  })
  return (
    <Dialog
      isOpen={isOpen}
      closeModal={() => setIsOpen(false)}
      title={form.fields.mode === "create" ? "Create new Library" : "Edit Library"}
      outerDialogClass="h-3/5 w-3/5 !max-w-3/5"
    >
      <Form form={form} onSubmit={onSubmit}>
        <DialogBody>
          <LeftTabs
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
                icon={<MdLocalLibrary />}
                placeholder="Enter a name for the library"
                autoFocus
              />

              <SelectLine
                labelClassName="w-28"
                label="Language"
                icon={<MdLanguage />}
                name="language"
                title={"Language"}
                options={unique(metadataAgents.result?.flatMap(a => a.supportedCountryCodes))}
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
                options={metadataAgents?.result?.map(a => a.name) ?? []}
              />
              <SelectLine
                labelClassName="w-28"
                label="File"
                icon={<MdScan />}
                name="fileScanners"
                title={"File scanners"}
                options={fileScanners?.result?.map(a => a.name) ?? []}
              />
            </TabContent>
            <TabContent>
              <div className="flex h-full ">
                <div className="h-full min-w-1/2 overflow-auto">
                  <h3 className="mb-3 text-xl">Library folders</h3>
                  {form.fields.folders.map((folder, index) => (
                    <div key={index} className="mb-2 flex items-center justify-between rounded bg-elevate p-2">
                      {folder}
                      <button
                        onClick={() => {
                          const folders = [...form.fields.folders]
                          folders.splice(index, 1)
                          form.setFields({ folders })
                        }}
                      >
                        <MdClose />
                      </button>
                    </div>
                  ))}
                </div>
                <FolderManager
                  className="min-w-1/2 flex-grow justify-between"
                  contentClassName="h-4/5 overflow-y-auto"
                  onSelectFolder={path => {
                    form.setFields({ folders: unique([...form.fields.folders, path]) })
                  }}
                />
              </div>
            </TabContent>
          </LeftTabs>
        </DialogBody>
        <DialogActions>
          <DialogButtons closeModal={() => setIsOpen(false)} />
        </DialogActions>
      </Form>
    </Dialog>
  )
}
