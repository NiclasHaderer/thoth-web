import React from 'react';

import { MainMenu } from './App/Menu';
import { RouterOutlet } from './App/RouterOutlet';

function App() {
  return <MainMenu>
    <RouterOutlet/>
  </MainMenu>;
}

export default App;
