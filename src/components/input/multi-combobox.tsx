import { ReactNode, useState } from "react"
import {
  Combobox,
  ComboboxChip,
  ComboboxChipList,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
} from "@thoth/components/ui/combobox"

interface Option<K extends string> {
  id: K
  label: string
}

const CREATE_KEY = "__create__"

export const MultiCombobox = <K extends string>({
  label,
  options,
  value,
  onChange,
  onCreate,
  labelClassName,
  leftIcon,
}: {
  label: string
  options: Option<K>[]
  value: K[]
  onChange: (value: K[]) => void
  onCreate?: ((label: string) => Promise<K>) | undefined
  labelClassName?: string | undefined
  leftIcon?: ReactNode | undefined
}) => {
  const [query, setQuery] = useState("")
  const trimmed = query.trim()
  const trimmedLower = trimmed.toLowerCase()
  const showCreate =
    !!onCreate && trimmed.length > 0 && !options.some(option => option.label.toLowerCase() === trimmedLower)

  const handleChange = async (keys: (string | number)[]) => {
    const ids = keys.map(String)
    if (!ids.includes(CREATE_KEY)) return onChange(ids as K[])
    const rest = ids.filter(id => id !== CREATE_KEY) as K[]
    setQuery("")
    const created = await onCreate!(trimmed)
    onChange([...rest, created])
  }

  return (
    <div className="pb-4">
      <label className="flex items-center">
        <div className={`shrink-0 px-2 whitespace-nowrap ${labelClassName ?? ""}`}>{label}</div>
        <Combobox
          className="min-w-0 grow"
          selectionMode="multiple"
          value={value}
          onChange={keys => void handleChange(keys)}
          inputValue={query}
          onInputChange={setQuery}
          allowsEmptyCollection
        >
          <ComboboxChips>
            {leftIcon ? (
              <span className="text-muted-foreground flex items-center [&_svg]:size-4">{leftIcon}</span>
            ) : null}
            <ComboboxChipList<Option<K>>>
              {option => (
                <ComboboxChip id={option.id} className="max-w-full">
                  <span className="min-w-0 truncate">{option.label}</span>
                </ComboboxChip>
              )}
            </ComboboxChipList>
            <ComboboxChipsInput placeholder={label} />
          </ComboboxChips>
          <ComboboxContent>
            <ComboboxList renderEmptyState={() => <ComboboxEmpty>Nothing found</ComboboxEmpty>}>
              {options.map(option => (
                <ComboboxItem key={option.id} id={option.id} value={option}>
                  {option.label}
                </ComboboxItem>
              ))}
              {showCreate ? (
                <ComboboxItem id={CREATE_KEY} textValue={trimmed}>
                  Create "{trimmed}"
                </ComboboxItem>
              ) : null}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </label>
    </div>
  )
}
