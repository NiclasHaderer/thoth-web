import React from 'react';
import { MdBook, MdCollectionsBookmark, MdPerson, MdRefresh } from 'react-icons/md';
import { AudiobookClient } from '../../API/AudiobookClient';
import { ActiveLink, ALink } from '../Common/ActiveLink';
import { Ripple } from '../Common/Ripple';
import { Search } from './Search';

const MenuImage: React.VFC = () => {
  return (
    <ALink href="/" className="flex rounded-l-xl overflow-hidden" aria-label={'HOME'}>
      <div className="group-focus:bg-light-active pr-2 inline-flex items-center cursor-pointer">
        <img className="h-20 p-3" src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Thoth.svg" loading="lazy"
             alt="Logo"/>
        <h1 className="font-extrabold font-serif text-3xl">THOTH</h1>
      </div>
    </ALink>
  );
};

export const SearchBar: React.VFC = () => (
  <div className="bg-elevate flex items-center m-3 rounded-xl min-h-20 h-20">
    <MenuImage/>
    <Search/>
    <MdRefresh className="cursor-pointer mr-3 h-8 w-8" style={{transform: 'scale(-1, 1)'}}
               onClick={() => AudiobookClient.rescan()}/>
  </div>
);

export const LargeMenu: React.FC = () => (
  <>
    <aside className="overflow-hidden inline-block bg-elevate rounded-xl my-10 ml-10 min-w-80 max-w-80">
      <MenuItems/>
    </aside>
  </>
);


export const SmallMenu: React.VFC = () => (
  <aside className="bg-background">
    <BottomToolbar className="bg-elevate"/>
  </aside>
);


const MenuItems: React.VFC = () => (
  <ul>
    <ActiveLink href="/books" withSubroutes={true}>
      <li
        className="flex w-full px-3 items-center group-focus:bg-light-active hover:bg-light-active transition-colors duration-300">
        <MdBook className="ml-3"/>
        <span className="inline-block m-3">Books</span>
      </li>
    </ActiveLink>
    <ActiveLink href="/series" withSubroutes={true}>
      <li
        className="flex w-full px-3 items-center group-focus:bg-light-active hover:bg-light-active transition-colors duration-300">
        <MdCollectionsBookmark className="ml-3"/>
        <span className="inline-block m-3">Series</span>
      </li>
    </ActiveLink>
    <ActiveLink href="/authors" withSubroutes={true}>
      <li
        className="flex w-full px-3 items-center group-focus:bg-light-active hover:bg-light-active transition-colors duration-300">
        <MdPerson className="ml-3"/>
        <span className="inline-block m-3">Authors</span>
      </li>
    </ActiveLink>
  </ul>
);


const BottomToolbar: React.VFC<{ className?: string }> = ({className = ''}) => (
  <div className={`flex justify-between items-center px-4 h-12 relative ${className}`}>
    <Ripple className="flex-grow h-full cursor-pointer bg-opacity-30" rippleClasses={'bg-primary bg-opacity-80'}>
      <ActiveLink href="/authors" withSubroutes={true} className="h-full flex items-center justify-center">
        <MdPerson className="aspect-square h-3/5 w-auto"/>
      </ActiveLink>
    </Ripple>
    <Ripple className="flex-grow h-full cursor-pointer" rippleClasses={'bg-primary bg-opacity-80'}>
      <ActiveLink href="/books" withSubroutes={true} className="h-full flex items-center justify-center">
        <MdBook className="aspect-square h-3/5 w-auto"/>
      </ActiveLink>
    </Ripple>
    <Ripple className="flex-grow h-full cursor-pointer" rippleClasses={'bg-primary bg-opacity-80'}>
      <ActiveLink href="/series" withSubroutes={true} className="h-full flex items-center justify-center">
        <MdCollectionsBookmark className="aspect-square h-3/5 w-auto"/>
      </ActiveLink>
    </Ripple>
  </div>
);
