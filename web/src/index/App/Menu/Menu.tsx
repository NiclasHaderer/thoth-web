import React from 'react';
import { MdAccountCircle, MdBook, MdCollectionsBookmark, MdPerson } from 'react-icons/md';
import { useBreakpoint } from '../../Hooks/Breakpoint';
import { usePlaybackState } from '../../State/Playback';
import { ActiveLink, ALink } from '../Common/ActiveLink';
import { Playback } from '../Playback';
import { Search } from './Search';

export const MainMenu: React.FC = ({children}) => {
  const breakPoint = useBreakpoint();
  const isPlaying = usePlaybackState(state => state.isPlaying);

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
      {isPlaying ? <Playback/> : null}
    </div>
  );
};


const LargeMenu: React.FC = ({children}) => (
  <div className="h-full w-screen flex relative">
    <aside className="overflow-hidden inline-block bg-elevate rounded-xl my-10 ml-10 min-w-80 max-w-80">
      <MenuItems/>
    </aside>
    <main className="mt-10 px-10 pb-10 inline overflow-x-hidden overflow-y-auto flex-grow">
      {children}
    </main>
  </div>
);


const SmallMenu: React.FC = ({children}) => (
  <div className="flex flex-col h-full">
    <aside className="block m-3 bg-elevate rounded-xl">
      <MenuItems/>
    </aside>
    <main className="block overflow-y-auto p-3">
      {children}
    </main>
  </div>
);


const MenuIcon: React.VFC = () => {
  return (
    <ALink href="/" className="flex">
      <div className="inline-flex items-center cursor-pointer">
        <img loading="lazy" className="h-20 p-3" src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Thoth.svg"
             alt="Logo"/>
        <h1 className="font-extrabold font-serif text-3xl">THOTH</h1>
      </div>
    </ALink>
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
