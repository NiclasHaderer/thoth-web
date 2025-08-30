/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment */
import {
  ChangeEvent,
  createContext,
  FormHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import { useOnMount } from "@thoth/hooks/lifecycle.ts"
import { notNullIsh } from "@thoth/utils/utils"

export type SubmitError<T extends Record<string, any>> = Partial<{
  [K in keyof T]: string[] | undefined
}>

export interface FormContext<T extends Record<string, any>> {
  fields: T
  setFields: (newValue: Partial<T>) => void
  setAllFields: (newValue: T) => void
  errors: SubmitError<T>
  setErrors: (newValue: Partial<{ [K in keyof T]: string | undefined }>) => void
  hasErrors: () => boolean
  touched: {
    [K in keyof T]: boolean
  }
  getErrors: () => SubmitError<T>
  setTouched: (newValue: Partial<{ [K in keyof T]: boolean }>) => void
  toFormTransformers: {
    [K in keyof T]?: (value: T[K]) => any
  }
  fromFormTransformers: {
    [K in keyof T]?: (value?: string | null) => T[K]
  }
  formValidators: {
    [K in keyof T]?:
      | ((value: T[K]) => string | undefined | null | true)
      | ((value: T[K]) => string | undefined | null | true)[]
  }

  restoreInitial: () => void
  markAllAsTouched: () => void
  revalidateAll: () => void
  forceValidateAll: () => void
  readonly contextType: symbol
}

const DEFAULT = Symbol("DEFAULT_FORM_CONTEXT")
export const CONTEXT = createContext<FormContext<Record<any, any>>>({
  fields: {},
  setFields: () => {},
  setAllFields: () => {},
  errors: {},
  setErrors: () => {},
  touched: {},
  hasErrors: () => false,
  setTouched: () => {},
  getErrors: () => ({}),
  toFormTransformers: {},
  fromFormTransformers: {},
  markAllAsTouched: () => {},
  contextType: DEFAULT,
  restoreInitial: () => {},
  formValidators: {},
  revalidateAll: () => {},
  forceValidateAll: () => {},
})

const getFilledObject = <T extends string | symbol | number, V>(state: T[], defaultValue: V): Record<T, V> => {
  return state.reduce(
    (acc, key) => ({
      ...acc,
      [key]: defaultValue,
    }),
    {} as Record<T, V>
  )
}

const useCurrentState = <T = undefined,>(value: T) => {
  const ref = useRef<T>(value)
  const [state, setState] = useState<T>(value)

  return [
    state,
    (newState: T) => {
      ref.current = newState
      setState(newState)
    },
    ref as Readonly<{ current: T }>,
  ] as const
}

export const useForm = <T extends Record<string, any>>(
  initialState: T,
  {
    reloadOnInitialChange,
    ...options
  }: {
    toForm?: FormContext<T>["toFormTransformers"]
    fromForm?: FormContext<T>["fromFormTransformers"]
    validate?: FormContext<T>["formValidators"]
    reloadOnInitialChange?: boolean
  } = {}
): FormContext<T> => {
  const [fields, setFields, currentFields] = useCurrentState(initialState)
  const [touched, setTouched, currentTouched] = useCurrentState(
    getFilledObject<keyof T, boolean>(Object.keys(initialState), false)
  )
  const [errors, setErrors, currentErrors] = useCurrentState(
    getFilledObject<keyof T, string[] | undefined>(Object.keys(initialState), undefined)
  )

  useOnMount(() => validateFields(currentFields.current))

  useEffect(() => {
    if (reloadOnInitialChange) {
      setFields(initialState)
    }
  }, [initialState, reloadOnInitialChange])

  const validateField = (key: keyof T, value: T[keyof T]): string[] | undefined => {
    const validator = options.validate && options.validate[key]
    if (validator) {
      if (Array.isArray(validator)) {
        const errors = validator
          .map(validator => validator(value))
          .filter(notNullIsh)
          .filter((e): e is string => typeof e !== "boolean")
        if (errors.length > 0) return errors
      } else {
        const error = validator(value)
        if (error && typeof error !== "boolean") return [error]
      }
    }
  }

  const validateFields = (fieldsToValidate: Partial<T>) => {
    const newErrors = getFilledObject<keyof T, string[] | undefined>(Object.keys(fieldsToValidate), undefined)
    for (const key of Object.keys(fieldsToValidate) as (keyof T)[]) {
      newErrors[key] = validateField(key, fieldsToValidate[key] as T[keyof T])
    }
    setErrors({ ...currentErrors.current, ...newErrors })
  }

  const markAllAsTouched = () => {
    setTouched(
      Object.keys(touched).reduce(
        (acc, key) => ({
          ...acc,
          [key]: true,
        }),
        {} as Record<keyof T, boolean>
      )
    )
  }

  return {
    fields,
    setFields: (newValue: Partial<T>) => {
      setFields({ ...currentFields.current, ...newValue })
      validateFields(newValue)
    },
    setAllFields: (newValue: T) => {
      setFields({ ...newValue })
      validateFields(newValue)
    },
    errors,
    setErrors: (newValue: Partial<Record<keyof T, string | undefined>>) => {
      setErrors({ ...currentErrors.current, ...newValue })
    },
    hasErrors: () => Object.values(currentErrors.current).some(notNullIsh),
    getErrors: () => {
      return Object.entries(currentErrors.current).reduce(
        (acc, [key, value]) => {
          if (value) {
            acc[key as keyof T] = value
          }
          return acc
        },
        {} as Record<keyof T, string[] | undefined>
      )
    },
    touched,
    setTouched: (newValue: Partial<Record<keyof T, boolean>>) => {
      setTouched({ ...currentTouched.current, ...newValue })
    },
    restoreInitial: () => setFields(initialState),
    fromFormTransformers: options.fromForm || {},
    toFormTransformers: options.toForm || {},
    formValidators: options.validate || {},
    markAllAsTouched,
    contextType: Symbol(`FORM_CONTEXT_${Math.random()}`),
    revalidateAll: () => validateFields(currentFields.current),
    forceValidateAll: () => {
      markAllAsTouched()
      validateFields(currentFields.current)
    },
  }
}

export const useField = <T extends Record<string, any>, K extends keyof T & string>(
  name: K
): {
  value: T[K]
  setValue: (newValue: T[K]) => void
  formSetValue: (newValue?: string | null) => void
  errors: string[] | undefined
  toForm: ((value: T[K]) => any) | undefined
  touched: boolean
  setTouched: (newValue: boolean) => void
} => {
  const { fields, setFields, touched, setTouched, fromFormTransformers, toFormTransformers, contextType, errors } =
    useContext(CONTEXT)
  if (contextType === DEFAULT) {
    console.error("useField must be used inside a FormProvider")
  }
  if (!(name in fields)) {
    console.error(`Could not find ${name} in form fields. Possible values are: ${Object.values(fields)}`)
  }

  return {
    value: fields[name],
    setValue: (newValue: T[K]) => setFields({ [name]: newValue }),
    formSetValue: (newValue?: string | null) => {
      setFields({
        [name]: fromFormTransformers[name]?.(newValue) ?? newValue,
      })
    },
    errors: errors[name],
    toForm: toFormTransformers[name],
    touched: touched[name],
    setTouched: (newValue: boolean) => {
      setTouched({ [name]: newValue })
    },
  }
}

export const useFieldUpdater = <T extends Record<string, any>, K extends keyof T & string>(
  field: K
): InputHTMLAttributes<HTMLInputElement> => {
  const { value, formSetValue, setTouched, toForm } = useField<T, K>(field)
  const [transformedValue, setTransformedValue] = useState(toForm?.(value) ?? value)

  useEffect(() => setTransformedValue(toForm?.(value) ?? value), [value, toForm])

  return {
    value: transformedValue,
    onChange: (e: ChangeEvent<HTMLInputElement>) => {
      formSetValue(e.target.value)
    },
    onBlur: () => {
      setTouched(true)
    },
  }
}

export const Form = <T extends Record<string, any>>({
  form,
  children,
  onSubmit,
  onSubmitError,
  ...props
}: {
  form: FormContext<T>
  children?: ReactNode | undefined
  onSubmit?: (values: T) => void
  onSubmitError?: (errors: SubmitError<T>) => void
} & Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit">) => (
  <form
    {...props}
    onSubmit={e => {
      e.preventDefault()
      e.stopPropagation()
      form.forceValidateAll()
      if (form.hasErrors()) {
        form.markAllAsTouched()
        onSubmitError?.(form.getErrors())
        return
      }
      onSubmit?.(form.fields)
    }}
  >
    <CONTEXT.Provider value={form}>{children}</CONTEXT.Provider>
  </form>
)
