import { SearchIcon } from '@heroicons/react/solid';
import React from 'react';

export const Search: React.VFC = () => {
  return (
    <div>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-2">
          <button type="submit" className="p-1">
            <SearchIcon className="w-6 h-6"/>
          </button>
        </span>
        <input
          type="search"
          placeholder="Search ..."
          className="mt-0
                    block
                    pl-10
                    w-full
                    px-0.5
                    border-0 border-b-2 border-gray-200
                    bg-transparent
                    transition duration-300
                    focus:ring-0 focus:border-black
                  "
        />
      </div>
    </div>
  );
};
