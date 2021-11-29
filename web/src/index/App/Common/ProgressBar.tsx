import React, { MouseEventHandler } from 'react';

export const ProgressBar: React.VFC<{
  className?: string,
  percentage: number | undefined,
  onChange?: (percentage: number) => void | undefined
}> = ({percentage, onChange, className}) => {

  const change: MouseEventHandler<HTMLElement> = (e) => {
    onChange && onChange(e.pageX / window.innerWidth)
  };

  return (
    <div className={`bg-gray-800 cursor-pointer h-1.5 ${className}`} onClick={change}>
      <div className={'absolute left-0 top-0 bottom-0 bg-primary transition-all duration-500'}
           style={{width: `${percentage ? percentage * 100 : 0}%`}}/>
    </div>
  );
};
