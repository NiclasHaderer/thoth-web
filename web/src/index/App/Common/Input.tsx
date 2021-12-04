import React, { ReactNode } from 'react';

interface InputProps {
  placeholder?: string | undefined;
  label?: string | undefined;
  icon?: ReactNode | undefined;
  iconPosition?: 'left' | 'right' | undefined;
}

export const Input: React.VFC<InputProps> = ({iconPosition = 'left', icon, placeholder, label}) => (
  <label className="flex items-center">
    {label ? <div className="px-2">
      {label}
    </div> : null}
    <p className="relative my-2 flex-grow">
      {icon ? <div
        className={`absolute top-1/2 transform -translate-y-full m-2 ${iconPosition === 'left' && icon ? 'left-0' : 'right-0'}`}>
        {icon}
      </div> : null}
      <input placeholder={placeholder}
             className={`p-2 w-full bg-elevate rounded-md box-border ${iconPosition === 'left' && icon ? 'pl-8' : 'pr-8'}`}/>
    </p>
  </label>
);

