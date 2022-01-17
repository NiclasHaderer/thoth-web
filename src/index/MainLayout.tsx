import { LargeMenu, SearchBar, SmallMenu } from './App/Menu/Menu';
import { Playback } from './App/Playback';
import { RouterOutlet } from './App/RouterOutlet';
import { useBreakpoint } from './Hooks/Breakpoint';
import { usePlaybackState } from './State/Playback';

const CHANGE_LAYOUT = 'md' as const;

export const TopBar = () => <SearchBar/>;

// TODO bottom bar is hidden on mobile until you scroll down
export const BottomBar = () => {
  const breakPoint = useBreakpoint();
  const isMD = breakPoint.matchDown(CHANGE_LAYOUT);

  const isPlaying = usePlaybackState(state => state.isPlaying);

  return (
    <div>
      {isPlaying ? <Playback className={isMD ? 'border-primary border-solid border-b-2 border-opacity-25' : ''}/> : null}
      {isMD ? <SmallMenu/> : null}
    </div>
  );
};


export const MainWindow = () => {
  const breakPoint = useBreakpoint();
  const isMD = breakPoint.matchDown(CHANGE_LAYOUT);

  return (
    <div className={`flex-grow ${isMD ? 'overflow-y-auto' : 'flex'}`}>
      {isMD ? null : <LargeMenu/>}
      <main tabIndex={-1} className={`px-10 overflow-x-hidden flex-grow overflow-y-auto ${isMD ? 'mt-4' : 'mt-10'}`}>
        <RouterOutlet/>
      </main>
    </div>
  );
};
