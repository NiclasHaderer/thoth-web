import React from 'react';

export interface ColoredButtonProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  color?: 'primary' | 'secondary' | undefined;
}

export const ColoredButton: React.FC<ColoredButtonProps> = ({children, color = 'primary', ...props}) => (
  <button {...props}
          className={`overflow-hidden group rounded-md ${color === 'primary' ? 'bg-primary' : 'bg-elevate'} ${props.className}`}>
    <div className="flex items-center px-3 py-1 hover:bg-light-active group-focus:bg-light-active">
      {children}
    </div>
  </button>
);
