import React from 'react';
import { MdAccountCircle, MdBook, MdCollectionsBookmark, MdPerson } from 'react-icons/md';
import { Link } from 'wouter';
import { Search } from './Menu/Search';
import { ActiveLink } from './shared/active-link';

export const MainMenu: React.FC = (props) => {
  return (<>
      <div className="elevate flex items-center h-20 m-3 rounded-xl">
        <MenuIcon/>
        <Search/>
        <MdAccountCircle className="cursor-pointer mr-3" fontSize="large"/>
      </div>
      <div className="w-screen flex relative" style={{height: 'calc(100vh - 5rem - 1.5rem)'}}>
        <aside className="overflow-hidden inline-block elevate rounded-xl m-10 min-w-80 max-w-80">
          <MenuItems/>
        </aside>
        <main className="inline mt-10 overflow-y-auto mr-10 flex-grow">
          {props.children}
        </main>
      </div>
    </>
  );
};

const MenuIcon: React.VFC = () => {
  return (
    <Link href="/">
      <div className="inline-flex items-center cursor-pointer">
        <img className="h-20 p-3" src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Thoth.svg" alt="logo"/>
        <h1 className="font-extrabold font-serif text-3xl">THOTH</h1>
      </div>
    </Link>
  );
};
const MenuItems: React.VFC = () => {
  return (
    <ul>
      <ActiveLink href="/books" withSubroutes={true}>
        <li className="flex w-full px-3 items-center hover:light-active transition-colors duration-300">
          <MdBook className="ml-3"/>
          <span className="inline-block m-3">Books</span>
        </li>
      </ActiveLink>
      <ActiveLink href="/series" withSubroutes={true}>
        <li className="flex w-full px-3 items-center hover:light-active transition-colors duration-300">
          <MdCollectionsBookmark className="ml-3"/>
          <span className="inline-block m-3">Series</span>
        </li>
      </ActiveLink>
      <ActiveLink href="/authors" withSubroutes={true}>
        <li className="flex w-full px-3 items-center hover:light-active transition-colors duration-300">
          <MdPerson className="ml-3"/>
          <span className="inline-block m-3">Authors</span>
        </li>
      </ActiveLink>
    </ul>
  );
};
