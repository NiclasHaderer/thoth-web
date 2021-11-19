import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BookIcon from '@mui/icons-material/Book';
import CollectionsBookmarkRoundedIcon from '@mui/icons-material/CollectionsBookmarkRounded';
import PersonSharpIcon from '@mui/icons-material/PersonSharp';
import React from 'react';
import { Link } from 'wouter';
import { ActiveLink } from '../utils/active-link';
import { Search } from './Search';

export const MainMenu: React.FC = (props) => {
  return (<>
      <div className="elevate flex items-center h-20 m-3 rounded-xl">
        <MenuIcon/>
        <Search/>
        <AccountCircleIcon className="cursor-pointer mr-3" fontSize="large"/>
      </div>
      <div className="w-screen flex relative" style={{height: 'calc(100vh - 5rem - 1.5rem)'}}>
        <aside className="overflow-hidden inline-block elevate rounded-xl m-10 min-w-80 max-w-80">
          <MenuItems/>
        </aside>
        <main className="inline mt-10 overflow-y-auto mr-10">
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
      <li className="flex px-3 hover:light-active transition-colors duration-300">
        <ActiveLink href="/books" withSubroutes={true}>
          <BookIcon className="ml-3"/>
          <span className="inline-block m-3">Books</span>
        </ActiveLink>
      </li>
      <li className="flex px-3 hover:light-active transition-colors duration-300">
        <ActiveLink href="/collections" withSubroutes={true}>
          <CollectionsBookmarkRoundedIcon className="ml-3"/>
          <span className="inline-block m-3">Collections</span>
        </ActiveLink>
      </li>
      <li className="flex px-3 hover:light-active transition-colors duration-300">
        <ActiveLink href="/authors" withSubroutes={true}>
          <PersonSharpIcon className="ml-3"/>
          <span className="inline-block m-3">Authors</span>
        </ActiveLink>
      </li>
    </ul>
  );
};
