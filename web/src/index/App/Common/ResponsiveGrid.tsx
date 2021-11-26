import React from 'react';

export const ResponsiveGrid: React.FC = ({children}) => {
  return <div className="w-full justify-items-center grid gap-4
  grid-cols-2
  sm:grid-cols-2
  md:grid-cols-3
  lg:grid-cols-4
  xl:grid-cols-5
  2xl:grid-cols-6
  ">
    {children}
  </div>;
};
