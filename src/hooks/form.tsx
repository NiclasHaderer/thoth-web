/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment */
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { notNullIsh } from "@thoth/utils/utils"

export interface FormContext<T extends Record<string, any>> {
  fields: T
  setFields: (newValue: Partial<T>) => void
  errors: {
    [K in keyof T]: string[] | undefined
  }
  setErrors: (newValue: Partial<{ [K in keyof T]: string | undefined }>) => void
  hasErrors: () => boolean
  touched: {
    [K in keyof T]: boolean
  }
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
  errors: {},
  setErrors: () => {},
  touched: {},
  hasErrors: () => false,
  setTouched: () => {},
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
  const [fields, setFields] = useState(initialState)
  useEffect(() => {
    if (reloadOnInitialChange) {
      setFields(initialState)
    }
  }, [initialState, reloadOnInitialChange])
  const [touched, setTouched] = useState(getFilledObject(Object.keys(initialState) as (keyof T)[], false))
  const [errors, setErrors] = useState(getFilledObject(Object.keys(initialState) as (keyof T)[], undefined))

  const validateField = (key: keyof T, value: T[keyof T]): string[] | undefined => {
    if (!touched[key]) return undefined

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
    setErrors(currErrors => ({ ...currErrors, ...newErrors }))
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
      setFields(currFields => ({ ...currFields, ...newValue }))
      validateFields(newValue)
    },
    errors,
    setErrors: (newValue: Partial<Record<keyof T, string | undefined>>) => {
      setErrors(currErrors => ({ ...currErrors, ...newValue }))
    },
    hasErrors: () => Object.values(errors).some(notNullIsh),
    touched,
    setTouched: (newValue: Partial<Record<keyof T, boolean>>) => {
      setTouched(currTouched => ({ ...currTouched, ...newValue }))
    },
    restoreInitial: () => setFields(initialState),
    fromFormTransformers: options.fromForm || {},
    toFormTransformers: options.toForm || {},
    formValidators: options.validate || {},
    markAllAsTouched,
    contextType: Symbol(`FORM_CONTEXT_${Math.random()}`),
    revalidateAll: () => validateFields(fields),
    forceValidateAll: () => {
      markAllAsTouched()
      validateFields(fields)
    },
  }
}

export const useField = <T extends Record<string, any>, K extends keyof T>(
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
      setTouched({ ...touched, [name]: newValue })
    },
  }
}

export const useFieldUpdater = <T extends Record<string, any>, K extends keyof T>(
  field: K
): React.InputHTMLAttributes<HTMLInputElement> => {
  const { value, formSetValue, setTouched, toForm } = useField<T, K>(field)
  const [transformedValue, setTransformedValue] = useState(toForm?.(value) ?? value)

  useEffect(() => setTransformedValue(toForm?.(value) ?? value), [value, toForm])

  return {
    value: transformedValue,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
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
  ...props
}: {
  form: FormContext<T>
  children?: ReactNode | undefined
  onSubmit?: (values: T) => void
} & Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit">) => (
  <form
    {...props}
    onSubmit={e => {
      e.preventDefault()
      e.stopPropagation()
      form.forceValidateAll()
      if (!form.hasErrors()) {
        onSubmit && onSubmit(form.fields)
      }
    }}
  >
    <CONTEXT.Provider value={form}>{children}</CONTEXT.Provider>
  </form>
)
