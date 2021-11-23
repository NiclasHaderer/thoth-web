import { MdSearch } from "react-icons/md";
import React from 'react';

export const Search: React.VFC = () => (
  <div className="px-3 flex-grow shadow-none relative">
    <div className="relative elevate rounded-3xl ">
        <span className="absolute inset-y-0 left-0 flex items-center pl-2">
          <button type="submit" className="p-1">
            <MdSearch className="w-6 h-6"/>
          </button>
        </span>
      <input
        type="search"
        placeholder="Search ..."
        className="mt-0
                    block
                    pl-10
                    px-0.5
                    py-2
                    w-full
                    border-0
                    shadow-none
                    bg-transparent
                    outline-none
                  "
      />
    </div>
    <div className="z-10 absolute mx-3 bottom-0 left-0 right-0 transform translate-y-full bg-background">
      <div className="elevate">
        <div className="elevate p-3 rounded-md">
          <SearchResults/>
        </div>
      </div>
    </div>
  </div>
);

export const SearchResults: React.VFC = () => (
  <>
    <h2 className="text-unimportant uppercase py-3">Authors</h2>
    <div className="flex items-center pb-3">
      <img className="rounded-full w-8 h-8" src="https://m.media-amazon.com/images/I/517WcD5gWeL.jpg"
           alt="AuthorImage"/>
      <h4 className="pl-3">J.K. Rowling</h4>
    </div>
    <div className="flex items-center pb-3">
      <img className="rounded-full w-8 h-8" src="https://m.media-amazon.com/images/I/517WcD5gWeL.jpg"
           alt="AuthorImage"/>
      <h4 className="pl-3">J.K. Rowling</h4>
    </div>
    <h2 className="text-unimportant uppercase py-3">Books</h2>
    <div className="flex items-center pb-3">
      <img className="rounded-s w-8 h-8" src="https://m.media-amazon.com/images/I/517WcD5gWeL.jpg"
           alt="AuthorImage"/>
      <h4 className="pl-3">J.K. Rowling</h4>
    </div>
    <div className="flex items-center pb-3">
      <img className="rounded-s w-8 h-8" src="https://m.media-amazon.com/images/I/517WcD5gWeL.jpg"
           alt="AuthorImage"/>
      <h4 className="pl-3">J.K. Rowling</h4>
    </div>
    <h2 className="text-unimportant uppercase py-3">Collections</h2>
    <div className="flex items-center pb-3">
      <img className="rounded-s w-8 h-8" src="https://m.media-amazon.com/images/I/517WcD5gWeL.jpg"
           alt="AuthorImage"/>
      <h4 className="pl-3">J.K. Rowling</h4>
    </div>
    <div className="flex items-center pb-3">
      <img className="rounded-s w-8 h-8" src="https://m.media-amazon.com/images/I/517WcD5gWeL.jpg"
           alt="AuthorImage"/>
      <h4 className="pl-3">J.K. Rowling</h4>
    </div>

  </>
);
