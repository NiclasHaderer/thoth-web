import { FieldMetaProps, useField } from 'formik';
import React, { HTMLInputTypeAttribute, MutableRefObject, ReactNode } from 'react';

interface InputProps extends React.HTMLAttributes<HTMLInputElement> {
  label?: string | undefined;
  icon?: ReactNode | undefined;
  iconPosition?: 'left' | 'right' | undefined;
  labelClassName?: string | undefined;
  name?: string | undefined;
  type?: HTMLInputTypeAttribute | undefined;
  meta?: FieldMetaProps<any> | undefined;
  inputRef?: MutableRefObject<any> | undefined;
}

export const Input: React.VFC<InputProps> = (
  {
    iconPosition = 'left',
    icon,
    label,
    placeholder = label,
    labelClassName,
    className,
    meta,
    inputRef,
    ...props
  }) => (
  <label className="flex items-center">
    {label ? <div className={`px-2 ${labelClassName}`}>
      {label}
    </div> : null}
    <div className="relative my-2 flex-grow">
      {icon ? <div
        className={`absolute top-1/2 -translate-y-1/2 p-2 ${iconPosition === 'left' && icon ? 'left-0' : 'right-0'}`}>
        {icon}
      </div> : null}
      <input placeholder={placeholder} {...props} ref={inputRef}
             className={`p-2 w-full bg-elevate rounded-md box-border ${iconPosition === 'left' && icon ? 'pl-8' : 'pr-8'} ${className ? className : ''}`}/>
      {meta?.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </div>
  </label>
);

export const FormikInput: React.VFC<InputProps & { name: string }> = ({name, ...props}) => {
  const [field, meta] = useField(name);
  return (
    <Input {...props} {...field} meta={meta}/>
  );
};
