import React from 'react';

import { MainMenu } from './components/Menu';
import { RouterOutlet } from './components/RouterOutlet';

function App() {
  return <MainMenu>
    <RouterOutlet/>
  </MainMenu>;
}

export default App;
