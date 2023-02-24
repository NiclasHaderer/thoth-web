import React, { createContext, ReactNode, useContext, useState } from "react"
import { notNullIsh } from "../utils"

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
    [K in keyof T]?: (value: string) => T[K]
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

const applyToFormTransformers = <T extends Record<string, any>>(
  state: Partial<T>,
  toForm?: FormContext<T>["toFormTransformers"]
) => {
  return Object.entries(state).reduce((acc, [key, value]) => {
    if (toForm && key in toForm) {
      acc[key as keyof T] = toForm[key as keyof T]!(value)
    }

    return acc
  }, {} as T)
}

const applyFromFormTransformers = <T extends Record<string, any>>(
  state: Partial<Record<keyof T, string>>,
  fromForm: FormContext<T>["fromFormTransformers"]
) => {
  return Object.entries(state).reduce((acc, [key, value]) => {
    if (fromForm && key in fromForm && value !== undefined) {
      acc[key as keyof T] = fromForm[key as keyof T]!(value)
    }

    return acc
  }, {} as T)
}

const getFilledObject = <T extends Record<string, any>, V>(state: T, defaultValue: V): Record<keyof T, V> => {
  return Object.keys(state).reduce(
    (acc, key) => ({
      ...acc,
      [key]: defaultValue,
    }),
    {} as Record<keyof T, V>
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
  initialState = applyToFormTransformers(initialState, options.fromForm)

  const [fields, setFields] = useState(initialState)
  const [touched, setTouched] = useState<Record<keyof T, boolean>>(getFilledObject(initialState, false))
  const [errors, setErrors] = useState<Record<keyof T, string[] | undefined>>(getFilledObject(initialState, undefined))

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
    const newErrors = getFilledObject<Partial<T>, undefined | string[]>(fieldsToValidate, undefined)
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
      setFields(currFields => ({ ...currFields, ...applyToFormTransformers(newValue, options.toForm) }))
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
  const { fields, setFields, touched, setTouched, fromFormTransformers, contextType } = useContext(CONTEXT)
  if (contextType === DEFAULT) {
    console.error("useField must be used inside a FormProvider")
  }

  return {
    value: fields[name],
    setValue: (newValue: T[keyof T]) => setFields({ [name]: newValue }),
    formSetValue: (newValue: string) => {
      setFields(applyFromFormTransformers({ [name]: newValue }, fromFormTransformers))
    },
    touched: touched[name],
    setTouched: (newValue: boolean) => {
      setTouched({ ...touched, [name]: newValue })
    },
  }
}

export const useFieldUpdater = <T extends Record<string, any>>(
  field: keyof T
): React.InputHTMLAttributes<HTMLInputElement> => {
  const { value, formSetValue, setTouched } = useField(field)

  return {
    value: value,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setTouched(true)
      formSetValue(e.target.value)
    },
  }
}

export const Form = <T extends Record<string, any>>({
  form,
  children,
  onSubmit,
}: {
  form: FormContext<T>
  children?: ReactNode | undefined
  onSubmit?: (values: T) => void
}) => (
  <form
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
