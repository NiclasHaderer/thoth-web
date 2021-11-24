import React from 'react';
import { MdAccountCircle, MdBook, MdCollectionsBookmark, MdPerson } from 'react-icons/md';
import { Link } from 'wouter';
import { useBreakpoint } from '../Hooks/Breakpoint';
import { ActiveLink } from './Common/active-link';
import { Search } from './Menu/Search';

export const MainMenu: React.FC = ({children}) => {
  const breakPoint = useBreakpoint();

  return (<div className="flex h-full flex-col h-screen">
      <div className="bg-elevate flex items-center h-20 m-3 rounded-xl">
        <MenuIcon/>
        <Search/>
        <MdAccountCircle className="cursor-pointer mr-3 h-8 w-8"/>
      </div>
      <div className="flex-grow overflow-hidden">
        {breakPoint.matchDown('lg') ?
          <SmallMenu children={children}/> : <LargeMenu children={children}/>
        }
      </div>
    </div>
  );
};


const LargeMenu: React.FC = ({children}) => (
  <div className="w-screen flex relative" style={{height: 'calc(100vh - 5rem - 1.5rem)'}}>
    <aside className="overflow-hidden inline-block bg-elevate rounded-xl m-10 min-w-80 max-w-80">
      <MenuItems/>
    </aside>
    <main className="my-10 inline overflow-x-hidden overflow-y-auto mr-10 flex-grow">
      {children}
    </main>
  </div>
);


const SmallMenu: React.FC = ({children}) => (
  <div className="flex flex-col h-full">
    <aside className="block m-3 bg-elevate rounded-xl">
      <MenuItems/>
    </aside>
    <main className="block pt-3 overflow-y-auto">
      {children}
    </main>
  </div>
);


const MenuIcon: React.VFC = () => {
  return (
    <Link href="/">
      <div className="inline-flex items-center cursor-pointer">
        <img loading="lazy" className="h-20 p-3" src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Thoth.svg"
             alt="Logo"/>
        <h1 className="font-extrabold font-serif text-3xl">THOTH</h1>
      </div>
    </Link>
  );
};
const MenuItems: React.VFC = () => {
  return (
    <ul>
      <ActiveLink href="/books" withSubroutes={true}>
        <li className="flex w-full px-3 items-center hover:bg-light-active transition-colors duration-300">
          <MdBook className="ml-3"/>
          <span className="inline-block m-3">Books</span>
        </li>
      </ActiveLink>
      <ActiveLink href="/series" withSubroutes={true}>
        <li className="flex w-full px-3 items-center hover:bg-light-active transition-colors duration-300">
          <MdCollectionsBookmark className="ml-3"/>
          <span className="inline-block m-3">Series</span>
        </li>
      </ActiveLink>
      <ActiveLink href="/authors" withSubroutes={true}>
        <li className="flex w-full px-3 items-center hover:bg-light-active transition-colors duration-300">
          <MdPerson className="ml-3"/>
          <span className="inline-block m-3">Authors</span>
        </li>
      </ActiveLink>
    </ul>
  );
};
