import { SearchIcon } from '@heroicons/react/solid';
import React from 'react';
import { Link, useRoute } from 'wouter';

export const MainMenu: React.FC = () => (
  <div className="w-screen h-screen flex">
    <aside className="w-1/4 bg-red-50 h-screen inline">
      <MenuIcon/>
      <MenuItems/>
    </aside>
    <main className="w-3/4 bg-green-50  h-screen inline">
      <Search/>
    </main>
  </div>
);

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

export const MenuIcon: React.VFC = () => {
  return (
    <>
      <div className="flex justify-center p-3">
        <img className="h-28" src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Thoth.svg"/>
      </div>
    </>
  );
};

export const MenuItems: React.VFC = () => {
  const [isActive] = useRoute(location.href);
  return (
    <ul>
      <li>
        <Link href="/books">
          <a className="w-full block p-2">Books</a>
        </Link>
      </li>
      <li>
        <Link href="/collections">
          <a className="w-full block p-2">Collections</a>
        </Link>
      </li>
      <li>
        <Link href="/authors">
          <a className="w-full block p-2">Authors</a>
        </Link>
      </li>
    </ul>
  );
};

const ActiveLink: React.FC<{ href: string }> = (props) => {
  const [isActive] = useRoute(props.href);
  return (
    <Link {...props}>
      <a className={isActive ? 'active' : ''}>{props.children}</a>
    </Link>
  );
};
