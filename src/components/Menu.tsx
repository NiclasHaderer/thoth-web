import React from 'react';
import { ActiveLink } from '../utils/active-link';
import { Search } from './Search';

export const MainMenu: React.FC = (props) => {
  return (
    <div className="w-screen h-screen flex">
      <aside className="w-1/4 bg-red-50 h-screen inline">
        <MenuIcon/>
        <MenuItems/>
      </aside>
      <main className="w-3/4 bg-green-50  h-screen inline">
        <Search/>
        <div className="bg-blue-100 overflow-y-auto" style={{height: 'calc(100% - 41px)'}}>
          {props.children}
        </div>
      </main>
    </div>
  );
};


const MenuIcon: React.VFC = () => {
  return (
    <>
      <div className="flex justify-center p-3">
        <img className="h-28" src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Thoth.svg"/>
      </div>
    </>
  );
};

const MenuItems: React.VFC = () => {
  return (
    <ul>
      <li>
        <ActiveLink href="/books">
          <a className="w-full block p-2">Books</a>
        </ActiveLink>
      </li>
      <li>
        <ActiveLink href="/collections">
          <a className="w-full block p-2">Collections</a>
        </ActiveLink>
      </li>
      <li>
        <ActiveLink href="/authors">
          <a className="w-full block p-2">Authors</a>
        </ActiveLink>
      </li>
    </ul>
  );
};
