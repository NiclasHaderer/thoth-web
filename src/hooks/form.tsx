import React, { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { notNullIsh } from "@thoth/utils"

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
    [K in keyof T]?: ((value: T[K]) => string | undefined) | ((value: T[K]) => string | undefined)[]
  }

  markAllAsTouched: () => void
  revalidateAll: () => void
  forceValidateAll: () => void
  readonly contextType: symbol
}

const DEFAULT = Symbol("DEFAULT_FORM_CONTEXT")
export const CONTEXT = createContext<FormContext<Record<any, any>>>({
  fields: {},
  setFields: _ => {},
  errors: {},
  setErrors: _ => {},
  touched: {},
  hasErrors: () => false,
  setTouched: _ => {},
  toFormTransformers: {},
  fromFormTransformers: {},
  markAllAsTouched: () => {},
  contextType: DEFAULT,
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
  options: {
    toForm?: FormContext<T>["toFormTransformers"]
    fromForm?: FormContext<T>["fromFormTransformers"]
    validate?: FormContext<T>["formValidators"]
  } = {}
): FormContext<T> => {
  const [fields, setFields] = useState(initialState)
  useEffect(() => setFields(initialState), [initialState])
  const [touched, setTouched] = useState(getFilledObject(Object.keys(initialState) as (keyof T)[], false))
  const [errors, setErrors] = useState(getFilledObject(Object.keys(initialState) as (keyof T)[], undefined))

  const validateField = (key: keyof T): string[] | undefined => {
    if (!touched[key]) return undefined

    const validator = options.validate && options.validate[key]
    if (validator) {
      if (Array.isArray(validator)) {
        const errors = validator.map(v => v(fields[key])).filter(notNullIsh)
        if (errors.length > 0) return errors
      } else {
        const error = validator(fields[key])
        if (error) return [error]
      }
    }
  }

  const validateFields = (fieldsToValidate: Partial<T>) => {
    const newErrors = getFilledObject<keyof T, string[] | undefined>(Object.keys(fieldsToValidate), undefined)
    for (const key of Object.keys(fieldsToValidate) as (keyof T)[]) {
      newErrors[key] = validateField(key)
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

export const useField = <T extends Record<string, any>>(name: keyof T) => {
  const { fields, setFields, touched, setTouched, fromFormTransformers, toFormTransformers, contextType } =
    useContext(CONTEXT)
  if (contextType === DEFAULT) {
    console.error("useField must be used inside a FormProvider")
  }

  return {
    value: fields[name],
    setValue: (newValue: T[keyof T]) => setFields({ [name]: newValue }),
    formSetValue: (newValue?: string | null) => {
      setFields({
        [name]: fromFormTransformers[name]?.(newValue) ?? newValue,
      })
    },
    toForm: toFormTransformers[name],
    touched: touched[name],
    setTouched: (newValue: boolean) => {
      setTouched({ ...touched, [name]: newValue })
    },
  }
}

export const useFieldUpdater = <T extends Record<string, any>>(
  field: keyof T
): React.InputHTMLAttributes<HTMLInputElement> => {
  const { value, formSetValue, setTouched, toForm } = useField(field)
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
