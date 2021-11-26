import React from 'react';

export interface ColoredButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
}

export const ColoredButton: React.FC<ColoredButtonProps> = ({children, ...props}) => (
  <button {...props} className={`overflow-hidden bg-primary rounded-md ${props.className}`}>
    <div className="flex items-center px-3 py-1 hover:bg-light-active">
      {children}
    </div>
  </button>
);
