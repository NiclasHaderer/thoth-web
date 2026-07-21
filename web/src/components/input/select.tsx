import { ReactNode, useMemo } from "react"
import { Key, Selection } from "react-aria-components"
import {
  Select as ShadSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue as SelectValueDisplay,
} from "@thoth/components/ui/select"
import { cn } from "@thoth/lib/utils"
import { deepEquals } from "@thoth/utils/equals"

type SelectValue<T> = {
  value: T
  label?: string
  disabled?: boolean
}

type ExtractedSelectValue<T> = T extends SelectValue<infer U> ? SelectValue<U> : T

export type SelectProps<T, MULTIPLE extends boolean = false> = {
  options: readonly SelectValue<T>[] | readonly T[]
  title: string
  displayValue?: (v: ExtractedSelectValue<T>) => string
  leftIcon?: ReactNode | undefined
  disabled?: boolean
  vDir?: "top" | "bottom"
  hDir?: "right" | "left"
  value?: MULTIPLE extends true ? SelectValue<T>[] | T[] : SelectValue<T> | T
  multiple?: MULTIPLE
  onChange?: (v: MULTIPLE extends true ? ExtractedSelectValue<T>[] : ExtractedSelectValue<T>) => void
  outerClassName?: string
  placeholderButtonClassName?: string
  placeholderClassName?: string
  optionClassName?: string
  optionListClassName?: string
  onBlur?: () => void
}

function getSelectedValue<T>(
  options: readonly (SelectValue<T> | T)[],
  value: SelectValue<T> | T | undefined | (SelectValue<T> | T)[],
  multiple: boolean | undefined
) {
  const getValue = (value: SelectValue<T> | T) => {
    if (typeof value === "object" && value !== null && "value" in value) {
      return value.value
    }
    return value
  }

  const areEqual = (a: SelectValue<T> | T, b: SelectValue<T> | T) => {
    return deepEquals(getValue(a), getValue(b), { allowAdditionalKeysInB: true })
  }

  if (value === undefined) return null
  const selectedValue = options.filter(option => {
    if (Array.isArray(value)) {
      return value.find(value => areEqual(value, option))
    } else {
      return areEqual(value, option)
    }
  })
  if (multiple) {
    return selectedValue
  }
  return selectedValue?.[0]
}

function isDisabledOption<T>(option: SelectValue<T> | T): boolean {
  return typeof option === "object" && option !== null && "disabled" in option ? !!option.disabled : false
}

export function Select<T, MULTIPLE extends boolean = false>({
  options,
  disabled,
  title,
  leftIcon,
  vDir = "bottom",
  hDir = "left",
  value,
  placeholderButtonClassName,
  placeholderClassName,
  optionClassName,
  optionListClassName,
  outerClassName,
  onChange,
  multiple,
  onBlur,
  displayValue = (v: ExtractedSelectValue<T>) => v?.toString() ?? "",
}: SelectProps<T, MULTIPLE>) {
  const opts = options as readonly (SelectValue<T> | T)[]

  const toDisplayValue = (value: SelectValue<T> | T): string => {
    if (typeof value === "object" && value !== null && "label" in value && value.label) {
      return value.label
    } else {
      return displayValue(value as ExtractedSelectValue<T>)
    }
  }

  const selectedIndices = useMemo(() => {
    const selected = getSelectedValue(opts, value, multiple)
    const list = Array.isArray(selected) ? selected : selected ? [selected] : []
    return list.map(s => opts.indexOf(s)).filter(i => i >= 0)
  }, [opts, value, multiple])

  const placement = `${vDir === "top" ? "top" : "bottom"} ${hDir === "right" ? "end" : "start"}` as const

  const emit = (indices: number[]) => {
    const selectedOptions = indices.map(i => opts[i])
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-explicit-any
    onChange?.((multiple ? selectedOptions : selectedOptions[0]) as any)
  }

  const selectionProps = multiple
    ? {
        selectionMode: "multiple" as const,
        selectedKeys: new Set(selectedIndices.map(String)),
        onSelectionChange: (keys: Selection) => {
          const indices = keys === "all" ? opts.map((_, i) => i) : [...keys].map(k => Number(k))
          emit(indices)
        },
      }
    : {
        selectedKey: selectedIndices[0] != null ? String(selectedIndices[0]) : null,
        onSelectionChange: (key: Key | null) => {
          if (key == null) return
          emit([Number(key)])
        },
      }

  return (
    <ShadSelect
      isDisabled={disabled}
      placeholder={title}
      className={cn("h-fit", outerClassName)}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...(selectionProps as any)}
    >
      <SelectTrigger onBlur={onBlur} className={cn("min-w-32", placeholderButtonClassName)}>
        {leftIcon}
        <SelectValueDisplay className={placeholderClassName} />
      </SelectTrigger>
      <SelectContent placement={placement} className={optionListClassName}>
        {opts.map((option, i) => (
          <SelectItem key={i} id={String(i)} isDisabled={isDisabledOption(option)} className={optionClassName}>
            {toDisplayValue(option)}
          </SelectItem>
        ))}
      </SelectContent>
    </ShadSelect>
  )
}
