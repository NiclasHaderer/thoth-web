import React from 'react';
import { MdBook, MdCollectionsBookmark, MdPerson, MdRefresh } from 'react-icons/md';
import { AudiobookClient } from '../../API/AudiobookClient';
import { useBreakpoint } from '../../Hooks/Breakpoint';
import { usePlaybackState } from '../../State/Playback';
import { ActiveLink, ALink } from '../Common/ActiveLink';
import { Playback } from '../Playback';
import { Search } from './Search';

export const MainMenu: React.FC = ({children}) => {
  const breakPoint = useBreakpoint();
  const isPlaying = usePlaybackState(state => state.isPlaying);

  return (<div className="flex h-full flex-col h-screen">
      <div className="bg-elevate flex items-center m-3 rounded-xl min-h-20 h-20">
        <MenuIcon/>
        <Search/>
        <MdRefresh className="cursor-pointer mr-3 h-8 w-8" style={{transform: 'scale(-1, 1)'}}
                   onClick={() => AudiobookClient.rescan()}/>
      </div>
      <div className="flex-grow overflow-hidden">
        {breakPoint.matchDown('md') ?
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
    <main tabIndex={-1} className="mt-10 px-10 pb-10 inline overflow-x-hidden overflow-y-auto flex-grow">
      {children}
    </main>
  </div>
);


const SmallMenu: React.FC = ({children}) => (
  <div className="flex flex-col h-full">
    <aside className="block m-3 bg-elevate rounded-xl">
      <div className="rounded-xl overflow-hidden">
        <MenuItems/>
      </div>
    </aside>
    <main tabIndex={-1} className="block overflow-y-auto p-3">
      {children}
    </main>
  </div>
);


const MenuIcon: React.VFC = () => {
  return (
    <ALink href="/" className="flex" aria-label={'HOME'}>
      <div className="group-focus:bg-light-active pr-2 inline-flex items-center cursor-pointer">
        <img className="h-20 p-3" src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Thoth.svg" loading="lazy"
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
};
